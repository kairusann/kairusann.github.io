---
layout: post
title:  "App Data Usage Analysis"
date:   2018-07-11 23:13:17
categories: data
---

prepared by Kyle Zhong ([@kairusann](https://kairusann.github.io)) on 7/11/2018 for *coding exercise*

*Jupyter* with R kernel was used in this analysis becuase of its rich functionalities in general statistics. 
The first snipe of code is about loading in the data and get a gist on its shape, column types, basic statistics, etc.


```R
options(repr.plot.width=6, repr.plot.height=4) # Setting for plot area sizing
read_out_loud <- function(path) {
    df <- read.csv(path)
    print(path)
    cat("______FIRST_5_ROWS________\n")
    print(head(df,5))
    cat("______STAT_SUMMARY________\n")
    print(summary(df))
    cat("\n")
    return(df)
}

activity     <- read_out_loud("activity_data.csv")
publisher    <- read_out_loud("app_publisher.csv")
demo         <- read_out_loud("demo_info.csv")
activity_agg <- read_out_loud("additional_activity_data.csv")

#(Optional) Encode gender_id for better reporting
demo$gender_id <- factor(demo$gender_id,exclude=NULL, labels=c("Male","Female","Unspecified"))
```

    [1] "activity_data.csv"
    ______FIRST_5_ROWS________
      device_id                app_name minutes
    1      1255   Snapchat (Mobile App)    7.39
    2       873  Pinterest (Mobile App)    3.88
    3      1919   Facebook (Mobile App)  116.34
    4      1531 Yahoo Mail (Mobile App)  238.27
    5       748    Netflix (Mobile App)    4.59
    ______STAT_SUMMARY________
       device_id                               app_name       minutes        
     Min.   :   1   Google Play (Mobile App)       :2761   Min.   :    0.01  
     1st Qu.: 700   Google Search (Mobile App)     :2638   1st Qu.:    7.81  
     Median :1392   YouTube (Mobile App)           :2558   Median :   43.48  
     Mean   :1389   Facebook Messenger (Mobile App):2522   Mean   :  280.88  
     3rd Qu.:2080   Facebook (Mobile App)          :2455   3rd Qu.:  238.44  
     Max.   :2774   Instagram (Mobile App)         :1682   Max.   :13464.93  
                    (Other)                        :7824   NA's   :748       
    
    [1] "app_publisher.csv"
    ______FIRST_5_ROWS________
                               app_name       Publisher
    1              Walmart (Mobile App)        Wal-Mart
    2       Microsoft Word (Mobile App) Microsoft Sites
    3 Sam's Club Scan & Go (Mobile App)        Wal-Mart
    4            Pinterest (Mobile App)       Pinterest
    5              YouTube (Mobile App)    Google Sites
    ______STAT_SUMMARY________
                                           app_name            Publisher
     Amazon Mobile (Mobile App)                : 1   Amazon Sites   :3  
     Amazon Music with Prime Music (Mobile App): 1   Facebook       :3  
     Facebook (Mobile App)                     : 1   Google Sites   :3  
     Facebook Messenger (Mobile App)           : 1   Microsoft Sites:3  
     Google Play (Mobile App)                  : 1   Oath           :3  
     Google Search (Mobile App)                : 1   Wal-Mart       :3  
     (Other)                                   :15   (Other)        :3  
    
    [1] "demo_info.csv"
    ______FIRST_5_ROWS________
      device_id gender_id
    1      1125         2
    2      1465         1
    3       940         2
    4       759         2
    5      1968         2
    ______STAT_SUMMARY________
       device_id        gender_id    
     Min.   :   1.0   Min.   :1.000  
     1st Qu.: 694.2   1st Qu.:1.000  
     Median :1387.5   Median :2.000  
     Mean   :1387.5   Mean   :1.619  
     3rd Qu.:2080.8   3rd Qu.:2.000  
     Max.   :2774.0   Max.   :2.000  
                      NA's   :98     
    
    [1] "additional_activity_data.csv"
    ______FIRST_5_ROWS________
                             app_name total_devices    minutes
    1             Kindle (Mobile App)           379   43521.39
    2        Google Play (Mobile App)          3025  104154.07
    3           Facebook (Mobile App)          2672 2141691.64
    4            Walmart (Mobile App)           792   16149.21
    5 Facebook Messenger (Mobile App)          2722 1792877.26
    ______STAT_SUMMARY________
                                           app_name  total_devices 
     Amazon Mobile (Mobile App)                : 1   Min.   :  36  
     Amazon Music with Prime Music (Mobile App): 1   1st Qu.: 233  
     Facebook (Mobile App)                     : 1   Median : 783  
     Facebook Messenger (Mobile App)           : 1   Mean   :1141  
     Google Play (Mobile App)                  : 1   3rd Qu.:1776  
     Google Search (Mobile App)                : 1   Max.   :3025  
     (Other)                                   :15                 
        minutes         
     Min.   :    336.8  
     1st Qu.:   7956.8  
     Median :  57047.9  
     Mean   : 285183.6  
     3rd Qu.: 183969.9  
     Max.   :2141691.6  
                        
    
    

**Observations**

From the output of the summaries above, we quickly noticed the following:  
* This dataset contains 2,774 devices/smartphones
* Google Play appears to be the most installed Mobile App in this sample
* We have 748 missing values for the metric *Time spent (in minutes) in an entire month*
* The data *activity_data.csv* can be extended by joining with *app_publisher.csv* and *demo_info.csv* on *app_name* and *device_id* respectively

Since the *Time spent (in minutes) in an entire month* is the main metric for the analysis, the next chunk of codes will be a deep dive into it. 

**Address missing value in metric *minutes***

The dataset is about usage from a sample of smartphones users in a month. Naturally, apps not launched within the month will not be recorded. Thus, we can fill all missing values for metric *minutes* with 0 to indicate no usage observed for the month. 


```R
activity$minutes[is.na(activity$minutes)] <- 0
summary(activity)
```


       device_id                               app_name       minutes        
     Min.   :   1   Google Play (Mobile App)       :2761   Min.   :    0.00  
     1st Qu.: 700   Google Search (Mobile App)     :2638   1st Qu.:    6.29  
     Median :1392   YouTube (Mobile App)           :2558   Median :   38.59  
     Mean   :1389   Facebook Messenger (Mobile App):2522   Mean   :  271.52  
     3rd Qu.:2080   Facebook (Mobile App)          :2455   3rd Qu.:  224.73  
     Max.   :2774   Instagram (Mobile App)         :1682   Max.   :13464.93  
                    (Other)                        :7824                     


**Outliers**

Now that all missing values were filled. What about outliers? The initial thought would be to apply the simple yet powerful 3-Sigma rule here, but we would need to make sure the sample is normally distributed. A standard histogram plot will well serve the need.



```R
library(ggplot2)
ggplot(activity, aes(minutes)) + 
    geom_histogram(
        bins = 30,
        color="black",
        fill="white")
```




![png]({{ site.url }}/App_Use_Analysis-kzhong_files/App_Use_Analysis-kzhong_5_1.png)


This is nothing like a normally distributed sample. Based on its shape, there are two probability density functions -- Weibull and Gamma distribution with right parameters (shape, rate and scale). 

The *MASS* package in R contains a function called *fitdistr* that does Maximum-likelihood fitting of univariate distributions. I tried to fit the sample with this function but the fit doesn't look good. It could be the Maximum-likelihood algorithm got stuck on local minima. I ended up using an enhanced version of *fitdistr* from package 'fitdistplus', which includes additional estimation functions like moment matching estimation, quantile matching estimation and maximum goodness-of-fit estimation. 

In this chunk of code, we are trying to fit a probability density function (PDF) to the sample. I tested a couple combination of PDF and estimation function and figured out *gamma distribution* with *moment matching estimation* gives the best fit.



```R
library(fitdistrplus)
# weibull.fit <- fitdist(minutes, distr = "weibull", method = "mle", lower = c(0, 0))
# summary(weibull.fit)
gamma.fit <- fitdist(activity$minutes, 
                     distr = "gamma",      # gamma distribution give the best fit the this sample
                     method = "mme",       # moment matching estimation works perfect 
                     lower = c(0, 0))      # optim in R imposes no limits in searching. Since all paramaeters (cont'd)
                                           # in gamma distribution are postive, setting a lower boundary can (cont'd)
                                           # speed up the search and prevent NAs being produced.
summary(gamma.fit)

# weibull.params <- as.list(weibull.fit$estimate)
# ggplot(activity, aes(sample=minutes)) +
#     geom_qq(distribution=qweibull, dparams=weibull.params) + 
#     geom_abline()

gamma.params <- as.list(gamma.fit$estimate)              # obtain parameters from the fit 
ggplot(activity, aes(sample=minutes)) +
    geom_qq(distribution=qgamma, dparams=gamma.params) + # feed parameters for gamma distribution then plot (cont'd)
    geom_abline()                                        # against the sample; the abline() plots the y = x ref. line
```

    Loading required package: MASS
    Loading required package: survival
    


    Fitting of the distribution ' gamma ' by matching moments 
    Parameters : 
              estimate
    shape 0.2088363494
    rate  0.0007691317
    Loglikelihood:  Inf   AIC:  -Inf   BIC:  -Inf 





![png]({{ site.url }}/App_Use_Analysis-kzhong_files/App_Use_Analysis-kzhong_7_3.png)


PDF is well fitted using gamma PDF with the parameters shown above, especially when x is roughly under 6000. Graphically, I will argue that the two points on the upper right corner are outliers in this sample. The following code block is on outliers removal and exploration of insghts. 

**Insight of the Data**

The analysis below will look at the total installations and total minutes spent on each app.


```R
activity <- activity[activity$minutes < 10000,] # Removes minutes > 10,000
library(dplyr)
activity %>% 
    group_by(app_name) %>%                # "group by" statement as in SQL
    summarize(total_devices=n()           # defines aggregate function for each metric, n() works like count()
    , median_min=median(minutes)          # median is a better indicator for central tendency if sample is skewed
    , minutes=sum(minutes)                # total minutes spent
    ) %>%
    arrange(desc(median_min))             # arrange the data in descending order, same as "order by" in SQL

activity %>% 
    left_join(publisher) %>%              # same as "left join" in SQL but with name detection
    group_by(Publisher) %>%
    summarize(total_devices=n()
    , median_min=median(minutes)
    , minutes=sum(minutes)
    ) %>%
    arrange(desc(median_min))

activity %>% 
    left_join(demo) %>%
    group_by(gender_id) %>%
    summarize(total_devices=n()
    , median_min=median(minutes)
    , minutes=sum(minutes)
    ) %>%
    arrange(desc(median_min))
```

    
    Attaching package: 'dplyr'
    
    The following object is masked from 'package:MASS':
    
        select
    
    The following objects are masked from 'package:stats':
    
        filter, lag
    
    The following objects are masked from 'package:base':
    
        intersect, setdiff, setequal, union
    
    


<table>
<thead><tr><th scope=col>app_name</th><th scope=col>total_devices</th><th scope=col>median_min</th><th scope=col>minutes</th></tr></thead>
<tbody>
	<tr><td>Facebook (Mobile App)                     </td><td>2455                                      </td><td>691.620                                   </td><td>2253211.70                                </td></tr>
	<tr><td>Facebook Messenger (Mobile App)           </td><td>2522                                      </td><td>337.255                                   </td><td>1592690.58                                </td></tr>
	<tr><td>Instagram (Mobile App)                    </td><td>1682                                      </td><td> 59.460                                   </td><td> 381299.09                                </td></tr>
	<tr><td>Tumblr (Mobile App)                       </td><td> 221                                      </td><td> 55.170                                   </td><td>  46929.15                                </td></tr>
	<tr><td>Snapchat (Mobile App)                     </td><td>1317                                      </td><td> 51.070                                   </td><td> 216832.40                                </td></tr>
	<tr><td>YouTube (Mobile App)                      </td><td>2558                                      </td><td> 49.945                                   </td><td> 669268.06                                </td></tr>
	<tr><td>Yahoo Mail (Mobile App)                   </td><td> 630                                      </td><td> 39.715                                   </td><td>  61389.33                                </td></tr>
	<tr><td>Google Search (Mobile App)                </td><td>2636                                      </td><td> 28.410                                   </td><td> 314514.32                                </td></tr>
	<tr><td>Outlook (Mobile App)                      </td><td> 333                                      </td><td> 26.100                                   </td><td>  24501.16                                </td></tr>
	<tr><td>Pinterest (Mobile App)                    </td><td> 938                                      </td><td> 24.965                                   </td><td>  83109.57                                </td></tr>
	<tr><td>Netflix (Mobile App)                      </td><td> 807                                      </td><td> 18.570                                   </td><td> 168913.97                                </td></tr>
	<tr><td>GroupMe (Mobile App)                      </td><td> 170                                      </td><td> 16.605                                   </td><td>   7491.85                                </td></tr>
	<tr><td>Google Play (Mobile App)                  </td><td>2761                                      </td><td> 14.390                                   </td><td> 105095.24                                </td></tr>
	<tr><td>Amazon Mobile (Mobile App)                </td><td>1625                                      </td><td> 11.830                                   </td><td>  60618.90                                </td></tr>
	<tr><td>Yahoo Newsroom (Mobile App)               </td><td>  89                                      </td><td>  8.280                                   </td><td>   3428.69                                </td></tr>
	<tr><td>Walmart (Mobile App)                      </td><td> 747                                      </td><td>  7.740                                   </td><td>  14514.09                                </td></tr>
	<tr><td>Amazon Music with Prime Music (Mobile App)</td><td> 295                                      </td><td>  7.190                                   </td><td>  14209.43                                </td></tr>
	<tr><td>Kindle (Mobile App)                       </td><td> 336                                      </td><td>  6.225                                   </td><td>  48075.55                                </td></tr>
	<tr><td>Microsoft Word (Mobile App)               </td><td> 220                                      </td><td>  2.890                                   </td><td>   2078.65                                </td></tr>
	<tr><td>Sam's Club (Mobile App)                   </td><td>  53                                      </td><td>  2.160                                   </td><td>    438.90                                </td></tr>
	<tr><td><span style=white-space:pre-wrap>Sam's Club Scan &amp; Go (Mobile App)         </span></td><td><span style=white-space:pre-wrap>  43</span>                                          </td><td><span style=white-space:pre-wrap>  0.880</span>                                       </td><td><span style=white-space:pre-wrap>    384.54</span>                                    </td></tr>
</tbody>
</table>



    Joining, by = "app_name"
    


<table>
<thead><tr><th scope=col>Publisher</th><th scope=col>total_devices</th><th scope=col>median_min</th><th scope=col>minutes</th></tr></thead>
<tbody>
	<tr><td>Facebook       </td><td>6659           </td><td>328.850        </td><td>4227201.37     </td></tr>
	<tr><td>Snapchat, Inc  </td><td>1317           </td><td> 51.070        </td><td> 216832.40     </td></tr>
	<tr><td>Oath           </td><td> 940           </td><td> 37.490        </td><td> 111747.17     </td></tr>
	<tr><td>Pinterest      </td><td> 938           </td><td> 24.965        </td><td>  83109.57     </td></tr>
	<tr><td>Google Sites   </td><td>7955           </td><td> 23.930        </td><td>1088877.62     </td></tr>
	<tr><td>Netflix Inc.   </td><td> 807           </td><td> 18.570        </td><td> 168913.97     </td></tr>
	<tr><td>Microsoft Sites</td><td> 723           </td><td> 11.460        </td><td>  34071.66     </td></tr>
	<tr><td>Amazon Sites   </td><td>2256           </td><td> 10.615        </td><td> 122903.88     </td></tr>
	<tr><td>Wal-Mart       </td><td> 843           </td><td>  7.180        </td><td>  15337.53     </td></tr>
</tbody>
</table>



    Joining, by = "device_id"
    


<table>
<thead><tr><th scope=col>gender_id</th><th scope=col>total_devices</th><th scope=col>median_min</th><th scope=col>minutes</th></tr></thead>
<tbody>
	<tr><td>Female     </td><td>13722      </td><td>39.595     </td><td>3785124.5  </td></tr>
	<tr><td>Unspecified</td><td>  780      </td><td>39.360     </td><td> 207778.6  </td></tr>
	<tr><td>Male       </td><td> 7936      </td><td>36.610     </td><td>2076092.1  </td></tr>
</tbody>
</table>



Apparently, users are spending far more time on Facebook apps than other app publishers. Though Google apps have the highest number of installations, it's probably due to the large amount of Android users. It may surprise some people that Snapchat takes the 2nd place with great quality of users but a relatively small user group. Another fact to notice is that the number of female mobile users are way surpass male mobile users, but they spend approximately the same amount of time on smartphones. We could explore further by adding *gender* attribute to the *Publisher* table.


```R
activity %>% 
    left_join(publisher) %>%
    left_join(demo) %>%
    group_by(gender_id, Publisher) %>%
    summarize(total_devices=n()
    , median_min=median(minutes)
    , minutes=sum(minutes)
    ) %>%
    arrange(Publisher, desc(median_min)) %>%
    filter(gender_id!="Unspecified")
```

    Joining, by = "app_name"
    Joining, by = "device_id"
    


<table>
<thead><tr><th scope=col>gender_id</th><th scope=col>Publisher</th><th scope=col>total_devices</th><th scope=col>median_min</th><th scope=col>minutes</th></tr></thead>
<tbody>
	<tr><td>Female         </td><td>Amazon Sites   </td><td>1425           </td><td> 12.380        </td><td>  93649.96     </td></tr>
	<tr><td>Male           </td><td>Amazon Sites   </td><td> 752           </td><td>  8.305        </td><td>  25584.08     </td></tr>
	<tr><td>Female         </td><td>Facebook       </td><td>4004           </td><td>351.890        </td><td>2651968.55     </td></tr>
	<tr><td>Male           </td><td>Facebook       </td><td>2418           </td><td>287.355        </td><td>1418497.75     </td></tr>
	<tr><td>Female         </td><td>Google Sites   </td><td>4738           </td><td> 24.415        </td><td> 651707.35     </td></tr>
	<tr><td>Male           </td><td>Google Sites   </td><td>2938           </td><td> 23.550        </td><td> 409119.73     </td></tr>
	<tr><td>Female         </td><td>Microsoft Sites</td><td> 410           </td><td> 12.055        </td><td>  18443.52     </td></tr>
	<tr><td>Male           </td><td>Microsoft Sites</td><td> 298           </td><td> 10.785        </td><td>  14977.14     </td></tr>
	<tr><td>Female         </td><td>Netflix Inc.   </td><td> 488           </td><td> 20.400        </td><td> 117213.54     </td></tr>
	<tr><td>Male           </td><td>Netflix Inc.   </td><td> 289           </td><td> 10.610        </td><td>  46502.28     </td></tr>
	<tr><td>Female         </td><td>Oath           </td><td> 546           </td><td> 43.090        </td><td>  63335.63     </td></tr>
	<tr><td>Male           </td><td>Oath           </td><td> 361           </td><td> 33.540        </td><td>  45011.27     </td></tr>
	<tr><td>Female         </td><td>Pinterest      </td><td> 731           </td><td> 28.180        </td><td>  70886.75     </td></tr>
	<tr><td>Male           </td><td>Pinterest      </td><td> 173           </td><td> 11.850        </td><td>   8394.30     </td></tr>
	<tr><td>Male           </td><td>Snapchat, Inc  </td><td> 510           </td><td> 69.155        </td><td> 105090.88     </td></tr>
	<tr><td>Female         </td><td>Snapchat, Inc  </td><td> 762           </td><td> 44.025        </td><td> 105888.69     </td></tr>
	<tr><td>Female         </td><td>Wal-Mart       </td><td> 618           </td><td>  7.490        </td><td>  12030.49     </td></tr>
	<tr><td>Male           </td><td>Wal-Mart       </td><td> 197           </td><td>  5.960        </td><td>   2914.69     </td></tr>
</tbody>
</table>



We can observe that for most the apps, female users tend to spent more time than male users with the exception of Snapchat -- another intersting finding!

**Additional Activity Data**

The last piece of this anaysis is on combining with an aggregated *activity* dataset. All we need to do is rolling up the *activity* dataset to the same granularity as the aggregated one and do an union. After joining the dataset, we are no longer able to use median to represent the central tendency due to difference in granularity, i.e. we are not able to obtain the user-level usage data for the true median. In addition to median value, we also lose the capability to report on user demographics information. Therefore, the following analysis will focus on mobile app and its publisher by arithmetic mean of total minutes.


```R
activity %>% 
    group_by(app_name) %>%
    summarize(total_devices=n(), minutes=sum(minutes)) %>%
    bind_rows(activity_agg) %>%
    left_join(publisher) %>%
    group_by(Publisher, app_name) %>%
    summarize(total_devices=sum(total_devices)
              , minutes=sum(minutes)) %>%
    mutate(avg_min=minutes/total_devices) %>%
    arrange(desc(avg_min))

activity %>% 
    group_by(app_name) %>%
    summarize(total_devices=n(), minutes=sum(minutes)) %>%
    bind_rows(activity_agg) %>%
    left_join(publisher) %>%
    group_by(Publisher) %>%
    summarize(total_devices=sum(total_devices)
              , minutes=sum(minutes)) %>%
    mutate(avg_min=minutes/total_devices) %>%
    arrange(desc(avg_min))
```

    Joining, by = "app_name"
    


<table>
<thead><tr><th scope=col>Publisher</th><th scope=col>app_name</th><th scope=col>total_devices</th><th scope=col>minutes</th><th scope=col>avg_min</th></tr></thead>
<tbody>
	<tr><td>Facebook                                  </td><td>Facebook (Mobile App)                     </td><td>5127                                      </td><td>4394903.34                                </td><td>857.207595                                </td></tr>
	<tr><td>Facebook                                  </td><td>Facebook Messenger (Mobile App)           </td><td>5244                                      </td><td>3385567.84                                </td><td>645.607902                                </td></tr>
	<tr><td>Google Sites                              </td><td>YouTube (Mobile App)                      </td><td>5321                                      </td><td>1268690.30                                </td><td>238.430802                                </td></tr>
	<tr><td>Oath                                      </td><td>Tumblr (Mobile App)                       </td><td> 454                                      </td><td> 103977.07                                </td><td>229.024383                                </td></tr>
	<tr><td>Facebook                                  </td><td>Instagram (Mobile App)                    </td><td>3458                                      </td><td> 728128.96                                </td><td>210.563609                                </td></tr>
	<tr><td>Netflix Inc.                              </td><td>Netflix (Mobile App)                      </td><td>1590                                      </td><td> 326298.58                                </td><td>205.219233                                </td></tr>
	<tr><td>Snapchat, Inc                             </td><td>Snapchat (Mobile App)                     </td><td>2663                                      </td><td> 400802.29                                </td><td>150.507807                                </td></tr>
	<tr><td>Amazon Sites                              </td><td>Kindle (Mobile App)                       </td><td> 715                                      </td><td>  91596.94                                </td><td>128.107608                                </td></tr>
	<tr><td>Google Sites                              </td><td>Google Search (Mobile App)                </td><td>5545                                      </td><td> 626291.58                                </td><td>112.947084                                </td></tr>
	<tr><td>Oath                                      </td><td>Yahoo Mail (Mobile App)                   </td><td>1309                                      </td><td> 111185.49                                </td><td> 84.939259                                </td></tr>
	<tr><td>Pinterest                                 </td><td>Pinterest (Mobile App)                    </td><td>1933                                      </td><td> 155733.82                                </td><td> 80.565867                                </td></tr>
	<tr><td>Microsoft Sites                           </td><td>Outlook (Mobile App)                      </td><td> 670                                      </td><td>  47748.24                                </td><td> 71.266030                                </td></tr>
	<tr><td>Microsoft Sites                           </td><td>GroupMe (Mobile App)                      </td><td> 344                                      </td><td>  14690.60                                </td><td> 42.705233                                </td></tr>
	<tr><td>Amazon Sites                              </td><td>Amazon Mobile (Mobile App)                </td><td>3302                                      </td><td> 129957.63                                </td><td> 39.357247                                </td></tr>
	<tr><td>Amazon Sites                              </td><td>Amazon Music with Prime Music (Mobile App)</td><td> 604                                      </td><td>  22166.19                                </td><td> 36.698990                                </td></tr>
	<tr><td>Google Sites                              </td><td>Google Play (Mobile App)                  </td><td>5786                                      </td><td> 209249.31                                </td><td> 36.164761                                </td></tr>
	<tr><td>Oath                                      </td><td>Yahoo Newsroom (Mobile App)               </td><td> 179                                      </td><td>   4986.60                                </td><td> 27.858101                                </td></tr>
	<tr><td>Wal-Mart                                  </td><td>Walmart (Mobile App)                      </td><td>1539                                      </td><td>  30663.30                                </td><td> 19.924172                                </td></tr>
	<tr><td><span style=white-space:pre-wrap>Wal-Mart       </span>                               </td><td><span style=white-space:pre-wrap>Sam's Club Scan &amp; Go (Mobile App)         </span></td><td><span style=white-space:pre-wrap>  79</span>                                          </td><td><span style=white-space:pre-wrap>    721.35</span>                                    </td><td><span style=white-space:pre-wrap>  9.131013</span>                                    </td></tr>
	<tr><td>Microsoft Sites                           </td><td>Microsoft Word (Mobile App)               </td><td> 410                                      </td><td>   3516.74                                </td><td>  8.577415                                </td></tr>
	<tr><td>Wal-Mart                                  </td><td>Sam's Club (Mobile App)                   </td><td> 120                                      </td><td>    974.47                                </td><td>  8.120583                                </td></tr>
</tbody>
</table>



    Joining, by = "app_name"
    


<table>
<thead><tr><th scope=col>Publisher</th><th scope=col>total_devices</th><th scope=col>minutes</th><th scope=col>avg_min</th></tr></thead>
<tbody>
	<tr><td>Facebook       </td><td>13829          </td><td>8508600.14     </td><td>615.27226      </td></tr>
	<tr><td>Netflix Inc.   </td><td> 1590          </td><td> 326298.58     </td><td>205.21923      </td></tr>
	<tr><td>Snapchat, Inc  </td><td> 2663          </td><td> 400802.29     </td><td>150.50781      </td></tr>
	<tr><td>Google Sites   </td><td>16652          </td><td>2104231.19     </td><td>126.36507      </td></tr>
	<tr><td>Oath           </td><td> 1942          </td><td> 220149.16     </td><td>113.36208      </td></tr>
	<tr><td>Pinterest      </td><td> 1933          </td><td> 155733.82     </td><td> 80.56587      </td></tr>
	<tr><td>Amazon Sites   </td><td> 4621          </td><td> 243720.76     </td><td> 52.74200      </td></tr>
	<tr><td>Microsoft Sites</td><td> 1424          </td><td>  65955.58     </td><td> 46.31712      </td></tr>
	<tr><td>Wal-Mart       </td><td> 1738          </td><td>  32359.12     </td><td> 18.61860      </td></tr>
</tbody>
</table>



**Conclusion**

The rank of apps and app publishers changed positions after we brought in additional *activity* data. Movement of Youtube and Netflix are very noticeable. However, we are uncertain about the cause due to we also change our method of calculation. Still, we can conclude that short videos are taking the place in digital content by looking at the result of this analysis.
