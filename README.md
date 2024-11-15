# Custom Visualization Design: Superhero Data

This visualization uses a dataset of superheroes and their attributes to create an interactive experience for exploring the relative strengths and characteristics of various characters.

Run using a live server.

## Dataset Information
The dataset used in this visualization was sourced from ([Source](https://www.kaggle.com/datasets/shreyasur965/super-heroes-dataset)). After removing null values, the dataset comprises 731 records with 331 unique entries containing complete data on attributes such as intelligence, strength, speed, durability, and power.

## Visualization Design

This project combines multiple visual elements to provide an engaging way to explore superhero attributes:

* Timeline Scatter Plot: The timeline shows various attributes plotted across time (first appearance). Each attribute is color-coded for easy distinction: light blue for intelligence, orange for strength, green for speed, red for durability, and purple for power.

* Interactive Word Cloud: The word cloud, inspired by ([Giorgia Lupi](http://giorgialupi.com/lalettura)), dynamically displays names of male (blue) and female (red) characters. Hovering over names highlights corresponding points in the timeline, and clicking opens a detailed card for each superhero.

* Superhero Info Card: Upon clicking on a superhero's name or timeline point, a card displays detailed information, including their attributes with progress bars, gender, alignment, first appearance, and publisher. The card design was influenced by visual elements from ([Superhero Database](https://www.superherodb.com/)).

## Interactions

Hover and click interactions enhance the exploration of data. Each attribute bar in the info card animates from 0% to the actual value, creating a dynamic experience. The word cloud and timeline synchronize to offer visual connections between characters and attributes.

## Category of Custom Visualization

This submission falls under the combinatorial category because it combines multiple visualization techniques (timeline scatter plot, word cloud, and interactive info cards) to create a cohesive, interactive data experience. Each component works together to allow deeper exploration of the dataset and enriches the user's interaction with superhero data.
