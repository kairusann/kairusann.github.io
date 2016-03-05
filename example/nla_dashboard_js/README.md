// All column names are aliased in custom.js file.  
    -- The purpose of this is to allow for flexibility if column names change in the future.  Changed column names should be updated at the alias, and those changes will propogate through the use of global variables throughout the application

// Condition Categories are built from the 'Condition class categories.csv' file.  
    -- This will allow for flexibility if Indicators or categories are added or removed from the dataset

/************
*************
ALIASES - NLA12_Condition_Estimates
*************
************/
var nla12_ce_record = "Record",
    nla12_ce_type = "Type",
    nla12_ce_subpop = "Subpopulation",
    nla12_ce_indic = "Indicator",
    nla12_ce_metcat = "Metric Category",
    nla12_ce_cat = "Category",
    nla12_ce_nresp = "NResp",
    nla12_ce_estp = "Estimate.P",
    nla12_ce_stderp = "StdError.P",
    nla12_ce_lcb95pctp = "LCB95Pct.P",
    nla12_ce_ucb95pctp = "UCB95Pct.P",
    nla12_ce_estu = "Estimate.U",
    nla12_ce_stderu = "StdError.U",
    nla12_ce_lcb95pctu = "LCB95Pct.U",
    nla12_ce_ucb95pctu = "UCB95Pct.U";

/************
*************
ALIASES - NLA0712_Change_Estimates
*************
************/
var nla0712_ce_record = "Record",
    nla0712_ce_type = "Type",
    nla0712_ce_subpop = "Subpopulation",
    nla0712_ce_indic = "Indicator",
    nla0712_ce_cat = "Category",
    nla0712_ce_diffestp = "DiffEst.P",
    nla0712_ce_stderp = "StdError.P",
    nla0712_ce_lcb95pctp = "LCB95Pct.P",
    nla0712_ce_ucb95pctp = "UCB95Pct.P",
    nla0712_ce_diffestu = "DiffEst.U",
    nla0712_ce_stderu = "StdError.U",
    nla0712_ce_lcb95pctu = "LCB95Pct.U",
    nla0712_ce_ucb95pctu = "UCB95Pct.U",
    nla0712_ce_nresp1 = "NResp_1",
    nla0712_ce_estp1 = "Estimate.P_1",
    nla0712_ce_stderp1 = "StdError.P_1",
    nla0712_ce_lcb95pctp1 = "LCB95Pct.P_1",
    nla0712_ce_ucb95pctp1 = "UCB95Pct.P_1",
    nla0712_ce_estu1 = "Estimate.U_1",
    nla0712_ce_stderu1 = "StdError.U_1",
    nla0712_ce_lcb95pctu1 = "LCB95Pct.U_1",
    nla0712_ce_ucb95pctu1 = "UCB95Pct.U_1",
    nla0712_ce_nresp2 = "NResp_2",
    nla0712_ce_estp2 = "Estimate.P_2",
    nla0712_ce_stderp2 = "StdError.P_2",
    nla0712_ce_lcb95pctp2 = "LCB95Pct.P_2",
    nla0712_ce_ucb95pctp2 = "UCB95Pct.P_2",
    nla0712_ce_estu2 = "Estimate.U_2",
    nla0712_ce_stderu2 = "StdError.U_2",
    nla0712_ce_lcb95pctu2 = "LCB95Pct.U_2",
    nla0712_ce_ucb95pctu2 = "UCB95Pct.U_2",
    nla0712_ce_ub2_ub1 = "UB2-UB1",
    nla0712_ce_lb2_lb1 = "LB2-LB1";


####################
NOTES
####################

-   Added Metric Categories to Condition Estimate Data
-   Added Categories for the following Indicators:
        Chlorophyll_a_Risk_Littoral
        Microcystin_Risk_Littoral
        Total_Mercury_Bottom
        Lake_Drawdown_Exposure
-   Had to subtract 57.5px from highest risk range intervals...not sure why, but it works... would like to know why
