---
layout: post
title:  "Script DBA Task (Data Pump) for AWS Oracle"
date:   2017-04-21 22:39:21
categories: data
---

## For listing data pump file and viewing log file:
```sql  
SELECT * FROM DBA_DIRECTORIES WHERE DIRECTORY_NAME = 'DATA_PUMP_DIR';
SELECT * FROM TABLE(RDSADMIN.RDS_FILE_UTIL.LISTDIR('DATA_PUMP_DIR'));
SELECT TEXT FROM TABLE(RDSADMIN.RDS_FILE_UTIL.READ_TEXT_FILE('ADUMP','DEV2PROD_042017.LOG'));
EXEC UTL_FILE.FREMOVE('DATA_PUMP_DIR','DEV2PROD_060717.LOG');  
```  

## PL/SQL to migrate huge volume of data (Table Mode)
```sql  
DECLARE
    h1 number;
begin
    h1 := dbms_datapump.open (operation => 'EXPORT', job_mode => 'TABLE', job_name => null); 
    DBMS_DATAPUMP.SET_PARALLEL(HANDLE => H1, DEGREE => 1); 
    dbms_datapump.add_file(handle => h1, filename => 'DEV2PROD_042117.LOG', directory => 'ADUMP', filetype => 3, reusefile => 1);
    dbms_datapump.set_parameter(handle => h1, name => 'KEEP_MASTER', value => 1); 
    dbms_datapump.metadata_filter(handle => h1, name => 'SCHEMA_EXPR', value => 'IN(''DM_MDS'')'); 
    DBMS_DATAPUMP.METADATA_FILTER(HANDLE => H1, NAME => 'NAME_EXPR', VALUE => 'IN(''F_PF_RESPONSE''
    ,''LK_PF_ANSWER''
    ,''LK_PF_QUESTION_DET''
    ,''LK_PF_ACCOUNT''
    ,''LK_PF_SECTION''
    ,''LK_PF_SECTION_TITLE''
    ,''LK_PF_SECTION_LONG_TITLE''
    ,''LK_PF_TOPIC''
    ,''LK_PF_TOPIC_TITLE''
    ,''LK_PF_ANSWER_TYPE''
    ,''LK_PF_QUESTION_REPORT_HEADER''
    ,''LK_PF_QUESTION_REPORT_GROUP''
    ,''f_sdi_data''
    ,''F_SDI_DATA_TOTAL''
    ,''lk_sdi_bank_demo''
    ,''LK_SDI_BK_CLASS''
    ,''LK_SDI_REGAGNT''
    ,''LK_MONTH''
    ,''LK_MONTH_IN_YEAR''
    ,''LK_QUARTER_OF_YEAR''
    ,''LK_STATE''
    ,''TMP_SOD_BRANCHMAP''
    ,''LK_SDI_FAILEDBANKS''
    ,''LK_ACCR_AGENCY'')'); 
    dbms_datapump.add_file(handle => h1, filename => 'DEV2PROD_042117.DMP', directory => 'DATA_PUMP_DIR', filetype => 1, reusefile => 1); 
    dbms_datapump.set_parameter(handle => h1, name => 'INCLUDE_METADATA', value => 1); 
    dbms_datapump.set_parameter(handle => h1, name => 'DATA_ACCESS_METHOD', value => 'AUTOMATIC'); 
    dbms_datapump.set_parameter(handle => h1, name => 'ESTIMATE', value => 'BLOCKS'); 
    dbms_datapump.start_job(handle => h1, skip_current => 0, abort_step => 0); 
    dbms_datapump.detach(handle => h1); 
END;
/  
```  

## Cleaning work after scheduled job completed

1. First we need to identify which jobs are in NOT RUNNING status. For this, we need to use below query (basically we are getting this info from dba_datapump_jobs)

```sql  
SET lines 200

SELECT owner_name, job_name, operation, job_mode,
state, attached_sessions
FROM dba_datapump_jobs
ORDER BY 1,2;
```  

The above query will give the datapump jobs information and it will look like below

OWNER_NAME JOB_NAME            OPERATION JOB_MODE  STATE       ATTACHED
———- ——————- ——— ——— ———– ——–
SCOTT      SYS_EXPORT_TABLE_01 EXPORT    TABLE     NOT RUNNING        0
SCOTT      SYS_EXPORT_TABLE_02 EXPORT    TABLE     NOT RUNNING        0
SYSTEM     SYS_EXPORT_FULL_01  EXPORT    FULL      NOT RUNNING        0

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

STATUS   OBJECT_ID OBJECT_TYPE  OWNER.OBJECT
——- ———- ———— ————————-
VALID        85283 TABLE        SCOTT.EXPDP_20051121
VALID        85215 TABLE        SCOTT.SYS_EXPORT_TABLE_02
VALID        85162 TABLE        SYSTEM.SYS_EXPORT_FULL_01

3. we need to now drop these master tables in order to cleanup the jobs

SQL> DROP TABLE SYSTEM.SYS_EXPORT_FULL_01;
SQL> DROP TABLE SCOTT.SYS_EXPORT_TABLE_02 ;
SQL> DROP TABLE SCOTT.EXPDP_20051121;

4. Re-run the query which is used in step 1 to check if still any jobs are showing up. If so, we need to stop the jobs once again using STOP_JOB parameter in expdp or DBMS_DATAPUMP.STOP_JOB package

Some imp points:

1. Datapump jobs that are not running doesn’t have any impact on currently executing ones.
2. When any datapump job (either export or import) is initiated, master and worker processes will be created.
3. When we terminate export datapump job, master and worker processes will get killed and it doesn’t lead to data courrption.
4. But when import datapump job is terminated, complete import might not have done as processes(master & worker)  will be killed.

```bash
sqlplus "mstr_meta/[anypwd]@(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(Host=csbs-mstrdma3e.chejgc8ejqix.us-east-1.rds.amazonaws.com)(Port=1521))(CONNECT_DATA=(SID=MSTRDM)))"
exp mstr_meta/[anypwd]@csbs-mstrdma3e.chejgc8ejqix.us-east-1.rds.amazonaws.com:1521/MSTRDM file=C:\Data\MSTR_META_170502.dmp log=C:\Data\MSTR_META_170502.log
imp mstr_meta/[anypwd]@csbs-mstrdma3e.chejgc8ejqix.us-east-1.rds.amazonaws.com:1521/MSTRDM file=C:\Data\CSBSMETA.dmp log=C:\Data\CSBSMETA_170502.log full=y commit=Y
```