## Week 2
### Meeting with TA (11/02/2021)
#### 1. Create a github repo
#### 2. Finish a concrete design for the final project

### Progress

#### 1.Choose sub-data set, Main Impressionists (12 artists ), from omniart_v3_datadump.csv. 
Name + No. of artworks in the set:    
frederic bazille 48  
gustave caillebotte 230  
mary cassatt 434  
paul cezanne 620  
edgar degas 898  
armand guillaumin 75  
edouard manet 344 / édouard manet 99  
claude monet 1576  
berthe morisot 263    
camille pissarro 1025  
pierre-auguste renoir 1462 / auguste renoir 46  
alfred sisley 523  

#### 2.Example painting for wireframing:
id: c4e07e03-b9ba-4f69-a1c1-2f253fb36b27  
artwork_name: Madame Thurneyssen  
artwork_type: painting  
creation_year: 1908  
artist_full_name: pierre-auguste renoir  
image_url: https://uploads6.wikiart.org/images/pierre-auguste-renoir/madame-thurneyssen-1908.jpg  
dominant_color: #783d12  
color_pallete: [u'#d6d5c5', u'#cda77f', u'#a2a596', u'#783d12', u'#c5baa7', u'#ad8654', u'#955819', u'#717a55', u'#645c36', u'#49562c', u'#404623', u'#2f2815']  
palette_count: [3901, 4277, 6157, 7011, 4736, 5077, 6546, 6146, 4747, 4586, 6629, 5723]  


#### 3.Wireframe Result
Version1: https://www.figma.com/file/wo37AXvqEteVxUUbm3Bueh/InfoVis?node-id=0%3A1

### To-dos
#### 1. Additional filtering
- Painting only since it is about colours (exclude drawing and others)

#### 2. Data cleaning
- Different names from the same artist (e.g. Pierre-Auguste Renoir 1462 / Auguste Renoir)

#### 3. What to do with artist has 2000 paintings or 100 paintings
- Are we going to show limited number per year?
- Are we going to use a different visualisation? (This approach)


## Week 3
### Meeting with TA (18/02/2021)
#### 1. Start work on the project based on figma concept
#### 2. Clean and process dataset


### UI To-dos
#### 1.Update the wireframe with new visualisation for artist artwork timeline


### Frontend To-dos
#### 1. Set up framework for the project
#### 2. Build components with D3
#### 3. Connect components with testing data


### Backend To-dos
#### 1. Filter data
- Main Impressionists (12 artists)
- Group artist's work under different naming formats
- Paintings only (artwork_type + general_type)
#### 2. Classify artworks by color
- Classfiy artist's artworks by dominate color 
- Find most used color category per artist
- Find most used color category per artist per year


### Progress
