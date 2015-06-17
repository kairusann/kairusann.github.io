---
layout: post
title:  "Simple Linear Regression"
date:   2015-06-15 20:06:13
categories: statistics
---

# Linear Regression

Linear regression example: This is a very simple example of using two scipy tools for linear regression, polyfit and stats.linregress.  
The first step will always be loading required libraries and creating sample data.

In [12]

{% highlight python %}
from scipy import linspace, polyval, polyfit, sqrt, stats, randn
from pylab import plot, title, show , legend
%matplotlib inline

n = 50 # number of points
t = linspace(-5,5,n)
t
{% endhighlight %}




    array([-5.        , -4.79591837, -4.59183673, -4.3877551 , -4.18367347,
           -3.97959184, -3.7755102 , -3.57142857, -3.36734694, -3.16326531,
           -2.95918367, -2.75510204, -2.55102041, -2.34693878, -2.14285714,
           -1.93877551, -1.73469388, -1.53061224, -1.32653061, -1.12244898,
           -0.91836735, -0.71428571, -0.51020408, -0.30612245, -0.10204082,
            0.10204082,  0.30612245,  0.51020408,  0.71428571,  0.91836735,
            1.12244898,  1.32653061,  1.53061224,  1.73469388,  1.93877551,
            2.14285714,  2.34693878,  2.55102041,  2.75510204,  2.95918367,
            3.16326531,  3.36734694,  3.57142857,  3.7755102 ,  3.97959184,
            4.18367347,  4.3877551 ,  4.59183673,  4.79591837,  5.        ])



Using linspace(), 50 data points were created within the interval [-5, 5]. Construct a trend with noise. 

In [14]

{% highlight python %}
a=0.8; b=-4 #parameters
x=polyval([a,b],t)
xn=x+randn(n) #add some noise
#Linear regressison -polyfit - polyfit can be used other orders polys
(ar,br)=polyfit(t,xn,1)
xr=polyval([ar,br],t)
#Linear regression using stats.linregress
(a_s,b_s,r,tt,stderr)=stats.linregress(t,xn)

#compute the mean square error
err=sqrt(sum((xr-xn)**2)/n)

print('Linear regression using polyfit')
print('parameters: a=%.2f b=%.2f \nregression: a=%.2f b=%.2f, ms error= %.3f' % (a,b,ar,br,err))
print('Linear regression using stats.linregress')
print('parameters: a=%.2f b=%.2f \nregression: a=%.2f b=%.2f, std error= %.3f' % (a,b,a_s,b_s,stderr))
{% endhighlight %}

    Linear regression using polyfit
    parameters: a=0.80 b=-4.00 
    regression: a=0.78 b=-4.10, ms error= 0.801
    Linear regression using stats.linregress
    parameters: a=0.80 b=-4.00 
    regression: a=0.78 b=-4.10, std error= 0.039
    

Not bad! To be clear, let's plot the result.

In [13]

{% highlight python %}
#matplotlib ploting
title('Linear Regression Example')
plot(t,x,'g.--')
plot(t,xn,'k.')
plot(t,xr,'r.-')
legend(['original','plus noise', 'regression'])
{% endhighlight %}




    <matplotlib.legend.Legend at 0xa660e10>




![png]({{ site.baseurl }}/notebooks/linreg_files/linreg_6_1.png)


The same result could be obtained using a different packages: stat.linregress()

In [11]

{% highlight python %}

{% endhighlight %}

    Linear regression using stats.linregress
    parameters: a=0.80 b=-4.00 
    regression: a=0.76 b=-3.73, std error= 0.046
    

#### Adapted from official scipy documentation.
