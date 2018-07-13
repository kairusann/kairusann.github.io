---
layout: post
title:  "Work with Oracle Data Pump on AWS"
date:   2017-04-21 22:39:21
categories: data
---

This content from this posts was extracted from my personal notes for routine DBA tasks on Oracle Database @ Amazon Web Services (AWS).


**The Data Pump Directory and Basic File Operations**  
The query below returns the Data Pump directory for Oracle database. You can simply execute it in your SQL Developer:  
```sql
SELECT * FROM TABLE(RDSADMIN.RDS_FILE_UTIL.LISTDIR('DATA_PUMP_DIR'))
```

You should see a list of files suffixed by .DMP and .LOG if there is any. These are dump files for the database or part of the database and the associated logs when these dump files are generated.  
Here is how to view the content of the log:  
```sql
SELECT TEXT FROM TABLE(RDSADMIN.RDS_FILE_UTIL.READ_TEXT_FILE('DATA_PUMP_DIR','MSTR_META_082517.LOG'));
```

Upon completion of migration task, you might want to clean up the Data Pump Directory with the following PL/SQL:  
```sql
EXEC UTL_FILE.FREMOVE('DATA_PUMP_DIR','MSTR_META_082517.LOG');
```

**Generating Dump Files**
```sql
DECLARE
    h1 number;
BEGIN
    h1 := dbms_datapump.open (operation => 'EXPORT', job_mode => 'TABLE', job_name => 'SDI_DATA_082217'); 
    DBMS_DATAPUMP.SET_PARALLEL(HANDLE => H1, DEGREE => 1); 
    dbms_datapump.add_file(handle => h1, filename => 'SDI_DATA_082217.LOG', directory => 'DATA_PUMP_DIR', filetype => 3, reusefile => 1);
    dbms_datapump.set_parameter(handle => h1, name => 'KEEP_MASTER', value => 1); 
    dbms_datapump.metadata_filter(handle => h1, name => 'SCHEMA_EXPR', value => 'IN(''DM_MDS'')'); 
    DBMS_DATAPUMP.METADATA_FILTER(HANDLE => H1, NAME => 'NAME_EXPR', VALUE => 'IN(
    ''IND_SDI_BANK_CURRENT''
    , ''IND_SDI_CB''
    , ''IND_SDI_STATECHARTER''
    , ''IND_SDI_SUBCHAPS''
    , ''LK_DAY''
    , ''LK_LAST_YEAR_DAY''
    , ''LK_MONTH''
    , ''LK_MONTH_IN_YEAR''
    , ''LK_PF_VALIDAGENCY''
    , ''LK_QUARTER''
    , ''LK_QUARTER_LY''
    , ''LK_QUARTER_OF_YEAR''
    , ''LK_SDI_BANK_DEMO''
    , ''LK_SDI_BK_CLASS''
    , ''LK_SDI_CBSA''
    , ''LK_SDI_CITY''
    , ''LK_SDI_COUNTY''
    , ''LK_SDI_CRNT_DEMO''
    , ''LK_SDI_FDICDBS''
    , ''LK_SDI_FDICSUPV''
    , ''LK_SDI_FED''
    , ''LK_SDI_FLDOFF''
    , ''LK_SDI_INSAGNT''
    , ''LK_SDI_MUTUAL''
    , ''LK_SDI_OCCDIST''
    , ''LK_SDI_OTSREGNM''
    , ''LK_SDI_REGAGNT''
    , ''LK_SDI_STATE''
    , ''LK_STATE''
    , ''LK_YEAR''
    , ''LK_YEAR_LY''
    , ''MV_F_SDI_ACCREDITATION''
    , ''MV_F_SDI_DATA''
    , ''MV_LK_SDI_BANK_DEMO_CRNT''
    , ''MV_LK_SDI_FAILEBANKS''
    , ''TMP_PF_3YRSECTIONI''
    , ''TMP_PF_ACCR_NUMBER''
    , ''TMP_PF_ACCREDITATION_REPORT''
    , ''TMP_PF_EXAMINERNR''
    , ''TMP_PF_EXAMINERTURNOVER''
    , ''TMP_SOD_BRANCHMAP''
    )'); 
    dbms_datapump.add_file(handle => h1, filename => 'SDI_DATA_082217.DMP', directory => 'DATA_PUMP_DIR', filetype => 1, reusefile => 1); 
    dbms_datapump.set_parameter(handle => h1, name => 'INCLUDE_METADATA', value => 1); 
    dbms_datapump.set_parameter(handle => h1, name => 'DATA_ACCESS_METHOD', value => 'AUTOMATIC'); 
    dbms_datapump.set_parameter(handle => h1, name => 'ESTIMATE', value => 'BLOCKS'); 
    dbms_datapump.start_job(handle => h1, skip_current => 0, abort_step => 0); 
    dbms_datapump.detach(handle => h1); 
END;
/
```  
The query above generates a dump file with the name **SDI_DATA_082217.DMP** and its log **SDI_DATA_082217.LOG**

**Clear Completed Jobs**
1. First we need to identify which jobs are in NOT RUNNING status. For this, we need to use below query (basically we are getting this info from dba_datapump_jobs)  

```sql
SET lines 200

SELECT owner_name, job_name, operation, job_mode,
state, attached_sessions
FROM dba_datapump_jobs
ORDER BY 1,2;
```

The above query will give the datapump jobs information and it will look like below  

| OWNER_NAME | JOB_NAME            | OPERATION | JOB_MODE | STATE       | ATTACHED |
| -------------------------------------------------------------------------------- |
| SCOTT      | SYS_EXPORT_TABLE_01 | EXPORT    | TABLE    | NOT RUNNING | 0        |
| SCOTT      | SYS_EXPORT_TABLE_02 | EXPORT    | TABLE    | NOT RUNNING | 0        |
| SYSTEM     | SYS_EXPORT_FULL_01  | EXPORT    | FULL     | NOT RUNNING | 0        |

In the above output, you can see state is showing as NOT RUNNING and those jobs need to be removed.  
Note: Please note that jobs state will be showing as NOT RUNNING even if a user wantedly stopped it. So before taking any action, consult the user and get confirmed

2. we need to now identify the master tables which are created for these jobs. It can be done as follows

```sql  
SELECT o.status, o.object_id, o.object_type,
       o.owner||'.'||object_name "OWNER.OBJECT"
  FROM dba_objects o, dba_datapump_jobs j
 WHERE o.owner=j.owner_name AND o.object_name=j.job_name
   AND j.job_name NOT LIKE 'BIN$%' ORDER BY 4,2;  
```  

| STATUS | OBJECT_ID | OBJECT_TYPE | OWNER.OBJECT              |
| ------------------------------------------------------------ |
| VALID  | 85283     | TABLE       | SCOTT.EXPDP_20051121      |
| VALID  | 85215     | TABLE       | SCOTT.SYS_EXPORT_TABLE_02 |
| VALID  | 85162     | TABLE       | SYSTEM.SYS_EXPORT_FULL_01 |

3. we need to now drop these master tables in order to cleanup the jobs  
```sql  
SQL> DROP TABLE SYSTEM.SYS_EXPORT_FULL_01;
SQL> DROP TABLE SCOTT.SYS_EXPORT_TABLE_02 ;
SQL> DROP TABLE SCOTT.EXPDP_20051121;
```

4. Re-run the query which is used in step 1 to check if still any jobs are showing up. If so, we need to stop the jobs once again using STOP_JOB parameter in expdp or DBMS_DATAPUMP.STOP_JOB package  
Some important points:  
1. Datapump jobs that are not running doesn’t have any impact on currently executing ones.
2. When any datapump job (either export or import) is initiated, master and worker processes will be created.
3. When we terminate export datapump job, master and worker processes will get killed and it doesn’t lead to data courrption.
4. But when import datapump job is terminated, complete import might not have done as processes(master & worker)  will be killed.

**Transfer Dump file**  
To transfer files between difference database instances, you need to create a database link first. For the code below, the "TO_PROD" is a database link with connection information for the Production Database.  
```sql
BEGIN
DBMS_FILE_TRANSFER.PUT_FILE(
source_directory_object       => 'DATA_PUMP_DIR',
source_file_name              => 'MSTR_META_082517.DMP',
destination_directory_object  => 'DATA_PUMP_DIR',
destination_file_name         => 'MSTR_META_082517.DMP', 
destination_database          => 'TO_PROD' 
);
END;
/ 
```

**Import a Dump File**
The import script is very much analogous to the export script except a few parameters. This following script is setup for importing the entire schema:  
```sql
set scan off
set serveroutput on
set escape off
whenever sqlerror exit 
DECLARE
    h1 number;
    errorvarchar varchar2(100):= 'ERROR';
    tryGetStatus number := 0;
begin
    h1 := dbms_datapump.open (operation => 'IMPORT', job_mode => 'SCHEMA', job_name => NULL, version => 'COMPATIBLE'); 
    tryGetStatus := 1;
    dbms_datapump.set_parallel(handle => h1, degree => 1); 
    dbms_datapump.add_file(handle => h1, filename => 'MSTR_META_082517.LOG', directory => 'DATA_PUMP_DIR', filetype => 3); 
    dbms_datapump.set_parameter(handle => h1, name => 'KEEP_MASTER', value => 1); 
    dbms_datapump.metadata_filter(handle => h1, name => 'SCHEMA_EXPR', value => 'IN(''MSTR_PROD_MD'')'); 
    dbms_datapump.add_file(handle => h1, filename => 'MSTR_META_082517.DMP', directory => 'DATA_PUMP_DIR', filetype => 1); 
    dbms_datapump.set_parameter(handle => h1, name => 'INCLUDE_METADATA', value => 1); 
    dbms_datapump.set_parameter(handle => h1, name => 'DATA_ACCESS_METHOD', value => 'AUTOMATIC'); 
    dbms_datapump.set_parameter(handle => h1, name => 'SKIP_UNUSABLE_INDEXES', value => 0);
    dbms_datapump.start_job(handle => h1, skip_current => 0, abort_step => 0); 
    dbms_datapump.detach(handle => h1); 
    errorvarchar := 'NO_ERROR'; 
EXCEPTION
    WHEN OTHERS THEN
    BEGIN 
        IF ((errorvarchar = 'ERROR')AND(tryGetStatus=1)) THEN 
            DBMS_DATAPUMP.DETACH(h1);
        END IF;
    EXCEPTION 
    WHEN OTHERS THEN 
        NULL;
    END;
    RAISE;
END;
/
```

**Legacy Oracle Data Dump (IMP/EXP)**  
Below DOS command is for the Oracle legacy data import/export tool. For some reasons you might want to get the dump file out of the DB instance, eg. download to your OS and email to the security/support team, this could be useful.  
```bash
sqlplus "mstr_meta/[anypwd]@(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(Host=csbs-mstrdma3e.chejgc8ejqix.us-east-1.rds.amazonaws.com)(Port=1521))(CONNECT_DATA=(SID=MSTRDM)))"
exp mstr_meta/[anypwd]@csbs-mstrdma3e.chejgc8ejqix.us-east-1.rds.amazonaws.com:1521/MSTRDM file=C:\Data\MSTR_META_170502.dmp log=C:\Data\MSTR_META_170502.log
imp mstr_meta/[anypwd]@csbs-mstrdma3e.chejgc8ejqix.us-east-1.rds.amazonaws.com:1521/MSTRDM file=C:\Data\CSBSMETA.dmp log=C:\Data\CSBSMETA_170502.log full=y commit=Y
```