---
layout: post
title:  "Openair Reference Manual for Statistics and Charting"
date:   2016-01-19 23:28:21
categories: data
---

Last updates: Tue Jan 19 23:28:21 2016

Take a look at all the openair statistics and graphs

### INITIALIZATION

```r
library(openair)
```

### aqStats

```r
## Statistics for 2004. NOTE! these data are in ppb/ppm so the
## example is for illustrative purposes only
aqStats(selectByDate(mydata, year = 2004), pollu=c("no2", "pm10"))
```

```
##   site pollutant year       date  dat.cap     mean minimum maximum median
## 1 site       NO2 2004 2004-01-01 99.77231 55.00867       0     185     51
## 2 site      PM10 2004 2004-01-01 97.99636 33.28752       2     208     31
##   daily.max max.roll.8 max.roll.24 percentile.95 percentile.99 hours days
## 1 105.54167  134.25000   106.00000           105           128     0   NA
## 2  74.14286   96.66667    75.09524            60            76    NA   20
```

```r
## transpose the results:
aqStats(selectByDate(mydata, year = 2004), pollu=c("no2", "pm10"),
transpose = TRUE)
```

```
## Warning: attributes are not identical across measure variables; they will
## be dropped
```

```
##    year      variable          NO2         PM10
## 1  2004          date 1.072915e+09 1.072915e+09
## 2  2004       dat.cap 9.977231e+01 9.799636e+01
## 3  2004          mean 5.500867e+01 3.328752e+01
## 4  2004       minimum 0.000000e+00 2.000000e+00
## 5  2004       maximum 1.850000e+02 2.080000e+02
## 6  2004        median 5.100000e+01 3.100000e+01
## 7  2004     daily.max 1.055417e+02 7.414286e+01
## 8  2004    max.roll.8 1.342500e+02 9.666667e+01
## 9  2004   max.roll.24 1.060000e+02 7.509524e+01
## 10 2004 percentile.95 1.050000e+02 6.000000e+01
## 11 2004 percentile.99 1.280000e+02 7.600000e+01
## 12 2004         hours 0.000000e+00           NA
## 13 2004          days           NA 2.000000e+01
```

### calcFno2

```r
## Users should see the full openair manual for examples of how
## to use this function.
```

### calcPercentile

```r
# 5, 50, 95th percentile monthly o3 concentrations
## Not run: 
percentiles <- calcPercentile(mydata, pollutant ="o3",
avg.time = "month", percentile = c(5, 50, 95))
head(percentiles)
```

```
##         date percentile.5 percentile.50 percentile.95
## 1 1998-01-01            0             2            14
## 2 1998-02-01            0             2             7
## 3 1998-03-01            1             4            15
## 4 1998-04-01            2             7            20
## 5 1998-05-01            2             7            25
## 6 1998-06-01            1             4            15
```

### calendarPlot

```r
# show wind vectors scaled by wind speed and different colours
calendarPlot(mydata, pollutant = "o3", year = 2003, annotate = "ws",
cols = "heat")
```

![plot of chunk calendarPlot]({{ site.url }}/assets/calendarPlot-1.png) 

### conditionalEval

```r
## Users should see the full openair manual for examples of how
## to use this function.
```

### conditionalQuantile

```r
# load example data from package
data(mydata)

## make some dummy prediction data based on 'nox'
mydata$mod <- mydata$nox*1.1 + mydata$nox * runif(1:nrow(mydata))

# basic conditional quantile plot
## A "perfect" model is shown by the blue line
## predictions tend to be increasingly positively biased at high nox,
## shown by departure of median line from the blue one.
## The widening uncertainty bands with increasing NOx shows that
## hourly predictions are worse for higher NOx concentrations.
## Also, the red (median) line extends beyond the data (blue line),
## which shows in this case some predictions are much higher than
## the corresponding measurements. Note that the uncertainty bands
## do not extend as far as the median line because there is insufficient
# to calculate them
conditionalQuantile(mydata, obs = "nox", mod = "mod")
```

![plot of chunk conditionalQuantile]({{ site.url }}/assets/conditionalQuantile-1.png) 

```r
## can split by season to show seasonal performance (not very
## enlightening in this case - try some real data and it will be!)

## Not run: conditionalQuantile(mydata, obs = "nox", mod = "mod", type = "season")
```

### corPlot

```r
# load openair data if not loaded already
data(mydata)
## basic corrgram plot
corPlot(mydata)
```

![plot of chunk corPlot]({{ site.url }}/assets/corPlot-1.png) 

### cutData

```r
## split data by day of the week
mydata <- cutData(mydata, type = "weekday")
head(mydata)
```

```
##                  date   ws  wd nox no2 o3 pm10    so2      co pm25
## 1 1998-01-01 00:00:00 0.60 280 285  39  1   29 4.7225  3.3725   NA
## 2 1998-01-01 01:00:00 2.16 230  NA  NA NA   37     NA      NA   NA
## 3 1998-01-01 02:00:00 2.76 190  NA  NA  3   34 6.8300  9.6025   NA
## 4 1998-01-01 03:00:00 2.16 170 493  52  3   35 7.6625 10.2175   NA
## 5 1998-01-01 04:00:00 2.40 180 468  78  2   34 8.0700  8.9125   NA
## 6 1998-01-01 05:00:00 3.00 190 264  42  0   16 5.5050  3.0525   NA
##    weekday
## 1 Thursday
## 2 Thursday
## 3 Thursday
## 4 Thursday
## 5 Thursday
## 6 Thursday
```

### GoogleMapsPlot

```r
## Users should see the full openair manual for examples of how
## to use this function.
```

### kernelExceed

```r
# Note! the manual contains other examples that are more illuminating
data(mydata)
# basic plot
kernelExceed(mydata, pollutant = "pm10")
```

```
## (loaded the KernSmooth namespace)
```

![plot of chunk kernelExceed]({{ site.url }}/assets/kernelExceed-1.png) 

```r
# condition by NOx concentrations
kernelExceed(mydata, pollutant = "pm10", type = "nox")
```

![plot of chunk kernelExceed]({{ site.url }}/assets/kernelExceed-2.png) 

### linearRelation

```r
# monthly relationship between NOx and SO2 - note rapid fall in
# ratio at the beginning of the series
linearRelation(mydata, x = "nox", y = "so2")
```

![plot of chunk linearRelation]({{ site.url }}/assets/linearRelation-1.png) 

```r
# PM2.5/PM10 ratio, but only plot where monthly R2 >= 0.8
linearRelation(mydata, x = "pm10", y = "pm25", rsq.thresh = 0.8)
```

![plot of chunk linearRelation]({{ site.url }}/assets/linearRelation-2.png) 

### modStats

```r
## the example below is somewhat artificial --- assuming the observed
## values are given by NOx and the predicted values by NO2.
## evaluation stats by season
modStats(mydata, mod = "no2", obs = "nox", type = "season")
```

```
##         season     n       FAC2        MB      MGE        NMB      NMGE
## 2 spring (MAM) 17343 0.25763083 -107.5466 107.5466 -0.6846951 0.6846951
## 3 summer (JJA) 14658 0.17140113 -116.2004 116.2004 -0.7053470 0.7053470
## 1 autumn (SON) 14775 0.09825963 -154.1534 154.1534 -0.7526324 0.7526324
## 4 winter (DJF) 16319 0.14201438 -143.1283 143.3366 -0.7494609 0.7505519
##       RMSE         r        COE       IOA
## 2 139.9177 0.8196724 -0.2497589 0.3751205
## 3 144.7206 0.7568891 -0.4197370 0.2901315
## 1 191.9351 0.7881365 -0.4370783 0.2814608
## 4 185.3849 0.8260512 -0.3207156 0.3396422
```

### percentileRose

```r
# 50/95th percentiles of ozone, with different colours
percentileRose(mydata, pollutant = "o3", percentile = c(50, 95), col = "brewer1")
```

![plot of chunk percentileRose]({{ site.url }}/assets/percentileRose-1.png) 

### polarAnnulus

```r
polarAnnulus(mydata, pollutant = "pm10", main = "diurnal variation in pm10 at Marylebone Road")
```

![plot of chunk polarAnnulus]({{ site.url }}/assets/polarAnnulus-1.png) 

### polarCluster

```r
# basic plot with 6 clusters
polarCluster(mydata, pollutant = "nox", n.clusters = 6)
```

![plot of chunk polarCluster]({{ site.url }}/assets/polarCluster-1.png) ![plot of chunk polarCluster]({{ site.url }}/assets/polarCluster-2.png) 

### polarFreq

```r
#windRose for just 2000 and 2003 with different colours
polarFreq(subset(mydata, format(date, "%Y") %in% c(2000, 2003)), type = "year", cols = "jet")
```

![plot of chunk polarFreq]({{ site.url }}/assets/polarFreq-1.png) 

### polarPlot

```r
# polarPlots by year on same scale
polarPlot(mydata, pollutant = "so2", type = "year", main = "polarPlot of so2")
```

![plot of chunk polarPlot]({{ site.url }}/assets/polarPlot-1.png) 

### pollutionRose

```r
## example of comparing 2 met sites
## first we will make some new ws/wd data with a postive bias
mydata$ws2 = mydata$ws + 2 * rnorm(nrow(mydata)) + 1
mydata$wd2 = mydata$wd + 30 * rnorm(nrow(mydata)) + 30
## need to correct negative wd
id <- which(mydata$wd2 < 0)
mydata$wd2[id] <- mydata$wd2[id] + 360
## results show postive bias in wd and ws
pollutionRose(mydata, ws = "ws", wd = "wd", ws2 = "ws2", wd2 = "wd2")
```

![plot of chunk pollutionRose]({{ site.url }}/assets/pollutionRose-1.png) 

### rollingMean

```r
## rolling 8-hour mean for ozone
mydata <- rollingMean(mydata, pollutant = "o3", width = 8, new.name = "rollingo3", data.thresh = 75, align = "right")
head(mydata)
```

```
##                  date   ws  wd nox no2 o3 pm10    so2      co pm25
## 1 1998-01-01 00:00:00 0.60 280 285  39  1   29 4.7225  3.3725   NA
## 2 1998-01-01 01:00:00 2.16 230  NA  NA NA   37     NA      NA   NA
## 3 1998-01-01 02:00:00 2.76 190  NA  NA  3   34 6.8300  9.6025   NA
## 4 1998-01-01 03:00:00 2.16 170 493  52  3   35 7.6625 10.2175   NA
## 5 1998-01-01 04:00:00 2.40 180 468  78  2   34 8.0700  8.9125   NA
## 6 1998-01-01 05:00:00 3.00 190 264  42  0   16 5.5050  3.0525   NA
##        ws2      wd2 rollingo3
## 1 3.934783 332.8202        NA
## 2 1.746268 190.4873        NA
## 3 2.416352 225.6476        NA
## 4 2.239299 152.7183        NA
## 5 1.298678 214.6545        NA
## 6 3.673257 216.6531        NA
```

### scatterPlot

```r
data(mydata)
scatterPlot(mydata, x = "nox", y = "no2", type = "year")
```

![plot of chunk scatterPlot]({{ site.url }}/assets/scatterPlot-1.png) 

### smoothTrend

```r
# several pollutants, no plotting symbol
smoothTrend(mydata, pollutant = c("no2", "o3", "pm10", "pm25"), pch = NA)
```

![plot of chunk smoothTrend]({{ site.url }}/assets/smoothTrend-1.png) 

### summaryPlot

```r
# exclude highest 5 % of data etc.
summaryPlot(mydata, percentile = 0.95, col.mis = "yellow")
```

```
##     date1     date2        ws        wd       nox       no2        o3 
##  "POSIXt" "POSIXct" "numeric" "integer" "integer" "integer" "integer" 
##      pm10       so2        co      pm25 
## "integer" "numeric" "numeric" "integer"
```

![plot of chunk summaryPlot]({{ site.url }}/assets/summaryPlot-1.png) 

### TaylorDiagram

```r
## in the examples below, most effort goes into making some artificial data
## the function itself can be run very simply
## Not run: 
## dummy model data for 2003
dat <- selectByDate(mydata, year = 2003)
dat <- data.frame(date = mydata$date, obs = mydata$nox, mod = mydata$nox)

## now make mod worse by adding bias and noise according to the month
## do this for 3 different models
dat <- transform(dat, month = as.numeric(format(date, "%m")))
mod1 <- transform(dat, mod = mod + 10 * month + 10 * month * rnorm(nrow(dat)),
model = "model 1")
## lag the results for mod1 to make the correlation coefficient worse
## without affecting the sd
mod1 <- transform(mod1, mod = c(mod[5:length(mod)], mod[(length(mod) - 3) :
length(mod)]))

## model 2
mod2 <- transform(dat, mod = mod + 7 * month + 7 * month * rnorm(nrow(dat)),
model = "model 2")
## model 3
mod3 <- transform(dat, mod = mod + 3 * month + 3 * month * rnorm(nrow(dat)),
model = "model 3")

mod.dat <- rbind(mod1, mod2, mod3)

## basic Taylor plot

TaylorDiagram(mod.dat, obs = "obs", mod = "mod", group = "model")
```

![plot of chunk TaylorDiagram]({{ site.url }}/assets/TaylorDiagram-1.png) 

### TheilSen

```r
# trend plot for ozone with p=0.01 i.e. uncertainty in slope shown at
# 99 % confidence interval
TheilSen(mydata, pollutant = "o3", ylab = "o3 (ppb)", alpha = 0.01)
```

```
## [1] "Taking bootstrap samples. Please wait."
```

![plot of chunk TheilSen]({{ site.url }}/assets/TheilSen-1.png) 

### timePlot

```r
# choose different line styles etc
## Not run: 
data(mydata)
timePlot(selectByDate(mydata, year = 2004, month = 6), pollutant =
c("nox", "no2"), lwd = c(1, 2), col = "black")
```

![plot of chunk timePlot]({{ site.url }}/assets/timePlot-1.png) 

### timeProp

```r
## monthly plot of NOx showing the contribution by wind sector
timeProp(mydata, pollutant="so2", avg.time="month", proportion="wd")
```

```
## Warning: 219 missing wind direction line(s) removed
```

![plot of chunk timeProp]({{ site.url }}/assets/timeProp-1.png) 

### timeVariation

```r
# basic use
timeVariation(mydata, pollutant = "nox")
```

![plot of chunk timeVariation]({{ site.url }}/assets/timeVariation-1.png) 

```r
# for a subset of conditions
## Not run: 
timeVariation(subset(mydata, ws > 3 & wd > 100 & wd < 270),
pollutant = "pm10", ylab = "pm10 (ug/m3)")
```

![plot of chunk timeVariation]({{ site.url }}/assets/timeVariation-2.png) 

```r
## End(Not run)

# multiple pollutants with concentrations normalised
## Not run: timeVariation(mydata, pollutant = c("nox", "co"), normalise = TRUE)

# show BST/GMT variation (see ?cutData for more details)
# the NOx plot shows the profiles are very similar when expressed in
# local time, showing that the profile is dominated by a local source
# that varies by local time and not by GMT i.e. road vehicle emissions

## Not run: timeVariation(mydata, pollutant = "nox", type = "dst", local.tz = "Europe/London")

## In this case it is better to group the results for clarity:
## Not run: timeVariation(mydata, pollutant = "nox", group = "dst", local.tz = "Europe/London")

# By contrast, a variable such as wind speed shows a clear shift when
#  expressed in local time. These two plots can help show whether the
#  variation is dominated by man-made influences or natural processes

## Not run: timeVariation(mydata, pollutant = "ws", group = "dst", local.tz = "Europe/London")

## It is also possible to plot several variables and set type. For
## example, consider the NOx and NO2 split by levels of O3:

## Not run: timeVariation(mydata, pollutant = c("nox", "no2"), type = "o3", normalise = TRUE)

## difference in concentrations
## Not run: timeVariation(mydata, poll= c("pm25", "pm10"), difference = TRUE)

# It is also useful to consider how concentrations vary by
# considering two different periods e.g. in intervention
# analysis. In the following plot NO2 has clearly increased but much
# less so at weekends - perhaps suggesting vehicles other than cars
# are important because flows of cars are approximately invariant by
# day of the week

## Not run: 
mydata <- splitByDate(mydata, dates= "1/1/2003", labels = c("before Jan. 2003", "After Jan. 2003"))
timeVariation(mydata, pollutant = "no2", group = "split.by", difference = TRUE)
```

![plot of chunk timeVariation]({{ site.url }}/assets/timeVariation-3.png) 

```r
## End(Not run)
```

### trajCluster

```r
## Not run: 
## import trajectories
traj <- importTraj(site = "london", year = 2009)
## calculate clusters use different distance matrix calculation, and calculate by season
traj <- trajCluster(traj, method = "Angle", type = "season", n.clusters = 4)
```

![plot of chunk trajCluster]({{ site.url }}/assets/trajCluster-1.png) 

```r
head(traj)
```

```
##   receptor year month day hour hour.inc    lat     lon height pressure
## 1        1 2009     2  25    0      -96 49.768 -11.119  377.2    984.1
## 2        1 2009     2  25    1      -95 49.845 -11.155  373.4    984.5
## 3        1 2009     2  25    2      -94 49.918 -11.182  370.7    984.8
## 4        1 2009     2  25    3      -93 49.986 -11.202  369.0    984.9
## 5        1 2009     2  25    4      -92 50.050 -11.214  368.4    984.8
## 6        1 2009     2  25    5      -91 50.108 -11.217  368.7    984.6
##                 date2       date       season len cluster
## 1 2009-02-25 00:00:00 2009-03-01 spring (MAM)  97      C1
## 2 2009-02-25 01:00:00 2009-03-01 spring (MAM)  97      C1
## 3 2009-02-25 02:00:00 2009-03-01 spring (MAM)  97      C1
## 4 2009-02-25 03:00:00 2009-03-01 spring (MAM)  97      C1
## 5 2009-02-25 04:00:00 2009-03-01 spring (MAM)  97      C1
## 6 2009-02-25 05:00:00 2009-03-01 spring (MAM)  97      C1
```

### trajLevel

```r
# show a simple case with no pollutant i.e. just the trajectories
# let's check to see where the trajectories were coming from when
# Heathrow Airport was closed due to the Icelandic volcanic eruption
# 15--21 April 2010.
# import trajectories for London and plot
## Not run: 
lond <- importTraj("london", 2010)

## End(Not run)
# more examples to follow linking with concentration measurements...

# import some measurements from KC1 - London
## Not run: 
kc1 <- importAURN("kc1", year = 2010)
# now merge with trajectory data by 'date'
lond <- merge(lond, kc1, by = "date")

# trajectory plot, no smoothing - and limit lat/lon area of interest
# use PSCF
trajLevel(subset(lond, lat > 40 & lat < 70 & lon >-20 & lon <20),
pollutant = "pm10", statistic = "pscf")
```

![plot of chunk trajLevel]({{ site.url }}/assets/trajLevel-1.png) 

```r
# can smooth surface, suing CWT approach:
trajLevel(subset(lond, lat > 40 & lat < 70 & lon >-20 & lon <20),
pollutant = "pm2.5", statistic = "cwt",  smooth = TRUE)
```

![plot of chunk trajLevel]({{ site.url }}/assets/trajLevel-2.png) 

```r
# plot by season:
trajLevel(subset(lond, lat > 40 & lat < 70 & lon >-20 & lon <20), pollutant = "pm2.5",
statistic = "pscf", type = "season")
```

![plot of chunk trajLevel]({{ site.url }}/assets/trajLevel-3.png) 

```r
## End(Not run)
```

### trajPlot

```r
# show a simple case with no pollutant i.e. just the trajectories
# let's check to see where the trajectories were coming from when
# Heathrow Airport was closed due to the Icelandic volcanic eruption
# 15--21 April 2010.
# import trajectories for London and plot
## Not run: 
lond <- importTraj("london", 2010)
# well, HYSPLIT seems to think there certainly were conditions where trajectories
# orginated from Iceland...
trajPlot(selectByDate(lond, start = "15/4/2010", end = "21/4/2010"))
```

![plot of chunk trajPlot]({{ site.url }}/assets/trajPlot-1.png) 

```r
## End(Not run)

# plot by day, need a column that makes a date
## Not run: 
lond$day <- as.Date(lond$date)
trajPlot(selectByDate(lond, start = "15/4/2010", end = "21/4/2010"),
type = "day")
```

![plot of chunk trajPlot]({{ site.url }}/assets/trajPlot-2.png) 

```r
## End(Not run)

# or show each day grouped by colour, with some other options set
## Not run: 
 trajPlot(selectByDate(lond, start = "15/4/2010", end = "21/4/2010"),
group = "day", col = "jet", lwd = 2, key.pos = "right", key.col = 1)
```

![plot of chunk trajPlot]({{ site.url }}/assets/trajPlot-3.png) 

```r
## End(Not run)
# more examples to follow linking with concentration measurements...
```

### trendLevel

```r
#basic use
#default statistic = "mean"
trendLevel(mydata, pollutant = "nox")
```

![plot of chunk trendLevel]({{ site.url }}/assets/trendLevel-1.png) 

### windRose

```r
# one windRose for each year
windRose(mydata,type = "year")
```

![plot of chunk windRose]({{ site.url }}/assets/windRose-1.png) 
