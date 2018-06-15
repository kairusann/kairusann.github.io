---
layout: post
title:  "sparklyr: R interface for Apache Spark"
date:   2018-06-14 16:00:21
categories: data
---

This notebook assumes you have a *Apache Spark* Livy server up and running and *sparklyr* installed within your R environment. If not, visit https://github.com/rstudio/sparklyr for the installation details. Most tutorials have Spark installed in the local environment, which is not a typical use case in a work environment. Normally, you should have your Spark nodes deployed to cloud computing servers from your choice of providers. 


```R
library(sparklyr)
sc <- spark_connect(master = "http://CSBS-112016-048.csbs.local:8998", method="livy")
sc$spark_version
```


    [1] '2.3.1'


Load the world famous R libraries


```R
library(ggplot2)
library(dplyr)
```

Get the sample data and copy it to the Spark server for analysis. For demo purpose, let's use the *iris* dataset


```R
iris_tbl <- copy_to(sc, iris, "iris", overwrite = TRUE)
iris_tbl
```


    # Source:   table<iris> [?? x 5]
    # Database: spark_connection
       Sepal_Length Sepal_Width Petal_Length Petal_Width Species
              <dbl>       <dbl>        <dbl>       <dbl> <chr>  
     1          5.1         3.5          1.4         0.2 setosa 
     2          4.9         3            1.4         0.2 setosa 
     3          4.7         3.2          1.3         0.2 setosa 
     4          4.6         3.1          1.5         0.2 setosa 
     5          5           3.6          1.4         0.2 setosa 
     6          5.4         3.9          1.7         0.4 setosa 
     7          4.6         3.4          1.4         0.3 setosa 
     8          5           3.4          1.5         0.2 setosa 
     9          4.4         2.9          1.4         0.2 setosa 
    10          4.9         3.1          1.5         0.1 setosa 
    # ... with more rows


You should see the above table is coming from the spark connection.   
Now, let's implement a simple k-means classification for the data:


```R
kmeans_model <- iris_tbl %>% 
  ml_kmeans(formula= ~ Petal_Width + Petal_Length, centers = 3)
kmeans_model
```


    K-means clustering with 3 clusters
    
    Cluster centers:
      Petal_Width Petal_Length
    1    1.359259     4.292593
    2    0.246000     1.462000
    3    2.047826     5.626087
    
    Within Set Sum of Squared Errors =  31.41289


A confusion matrix


```R
predicted <- ml_predict(kmeans_model, iris_tbl) %>% 
  collect

table(predicted$Species, predicted$prediction)
```


                
                  0  1  2
      setosa      0 50  0
      versicolor 48  0  2
      virginica   6  0 44


We'll end this tutorial by a plot


```R
options(repr.plot.width=6, repr.plot.height=4)
ml_predict(kmeans_model) %>%
  collect() %>%
  ggplot(aes(Petal_Length, Petal_Width)) +
  geom_point(aes(Petal_Width, Petal_Length, col = factor(prediction + 1)),
             size = 2, alpha = 0.5) + 
  geom_point(data = kmeans_model$centers, aes(Petal_Width, Petal_Length),
             col = scales::muted(c("red", "green", "blue")),
             pch = 'x', size = 12) +
  scale_color_discrete(name = "Predicted Cluster",
                       labels = paste("Cluster", 1:3)) +
  labs(
    x = "Petal Length",
    y = "Petal Width",
    title = "K-Means Clustering",
    subtitle = "Use Spark.ML to predict cluster membership with the iris dataset."
  )
```




![png]({{ site.url }}/assets/iris_output_11_1.png)

