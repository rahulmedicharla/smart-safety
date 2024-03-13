# Smart Safety
## The community based safety application

A problem we noticed on OSU's campus is that student awareness of off-campus crimes are low. The universities' notification system has certain conditions that must be met for off campus crimes to be reported and these conditions are usually not met resulting
in a lack of awareness about the crimes.

Our solution: We wanted to build a campus focused safety application with three main features.

1. Use past historical data to predict danger levels.
2. Allow for students to record and share real time crime alerts.
3. Use both the past and present to better plan for the future.

## Leveraging historical data

We found a large dataset of crimes that occurred off campus over the past 5-10 years including information such as the type of crime, location, and time of day. Using this data, there was two goals I wanted to achieve. One was to identify "hot zones"
of crime off campus. Using a k-means clustering algorithm and playing with the different model paramteres. I was able to identify the primary dense zones of crimes and displayed them on the app. My second goal was to create a way to predict risk/danger 
levels at a given moment in time and place. I chose to use the time & location as features for a simple linear regression algorithm, and classified the outputs into low, medium, and high risk.

## Crowd Sourced Alerts

We wanted to created a trusted network of real time crime alerts, so, leveraging Google Cloud Platform's realtime database, we found a way for students to record and share crime alerts and real time. We wanted to create a crowd sourced feature
that leverages the community to spread information.

## Safety-focused navigation

Another problem we found is that for google's navigation algorithm, though it may provide the fastest route, it may not necessary be the safest. Using the key insights from the historical data, and the real time crime alerts, we wanted to modify
the routing algorithm to keep safety as a higher priority. We chose to do this by defining multiple routes that a student could take, cross checking them with the "hot zones" and real time markers, and choosing one that avoids these markers.

## Watch the Demo Video!!

<a href="https://drive.google.com/file/d/1YNlhIwmHPmjs9tFJzJjEdlVHB5tY4T2R/view?usp=sharing">Demo</a>
