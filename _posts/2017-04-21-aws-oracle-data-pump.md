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
