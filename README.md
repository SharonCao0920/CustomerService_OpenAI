# **ML - Create a Customer Support Website with OPENAI models**
[Google Slides for Python](https://docs.google.com/presentation/d/110wkdPLv1HxS2wEj5NBrm1Br9f2UYO70l4Yxp-dtXrE/edit?usp=sharing)

## **Introduction**

This project is to use the popular OpenAI models to create a customer support website to answer questions from customers about their website.

### OpenAI API Models

#### *text-embedding-ada-002*

OpenAI’s text embeddings measure the relatedness of text strings. Embeddings are commonly used for:

* **Search** (where results are ranked by relevance to a query string)
* **Clustering** (where text strings are grouped by similarity)
* **Recommendations** (where items with related text strings are recommended)
* **Anomaly detection** (where outliers with little relatedness are identified)
* **Diversity measurement** (where similarity distributions are analyzed)
* **Classification** (where text strings are classified by their most similar label)

#### *text-davinci-003*

This model builds on top of previous InstructGPT models, and improves on a number of behaviors that we’ve heard are important to you as developers.

It includes the following improvements:
* It produces higher quality writing. This will help your applications deliver clearer, more engaging, and more compelling content.
* It can handle more complex instructions, meaning you can get even more creative with how you make use of its capabilities now.
* It’s better at longer form content generation, allowing you to take on tasks that would have previously been too difficult to achieve.

#### *gpt-3.5-turbo-instruct*

Similar capabilities as text-davinci-003 but compatible with legacy Completions endpoint and not Chat Completions.

### Update 9/18/2023
*Since text-davinci-003 model will be depreciated in 01/2024, I have replaced text-davinci-003 with gpt-3.5-turbo-instruct as recommanded on [OpenAI website.](https://platform.openai.com/docs/deprecations)*


<br>

## Project Design

This project will crawl data from [OpenAI](www.openai.com) and embedding the data with [gpt-3.5-turbo-instruct](https://platform.openai.com/docs/models/gpt-3-5) model. Users will be able to ask questions about the website and get an answer which could be actually found on the website.

### This project will be done in two ways:

1. [Python (Flask)](https://github.com/SharonCao0920/CustomerService_OpenAI/tree/main/Python)

2. [NodeJS (Next.js)](https://github.com/SharonCao0920/CustomerService_OpenAI/tree/main/NodeJS)

## To run then project

Copy the whole project

```
$ git clone https://github.com/SharonCao0920/CustomerService_OpenAI.git
```
### To run NodeJS version

Please read [details](https://github.com/SharonCao0920/CustomerService_OpenAI/tree/main/NodeJS) for getting ready to compile.

```
$ cd NodeJS
$ npm run dev
```

### To run Python version

Please read [details](https://github.com/SharonCao0920/CustomerService_OpenAI/tree/main/Python) for getting ready to compile.

```
$ cd Python
$ flask run
```

### **Tips on Saving Money for Developing**

OpenAI charges based on tokens, so to minimize the cost of deveopment for this project, I used a small size of data while developing to make the use of the grant given by the platform.

#### **Take Python Flask Project as an Example**

1. Run ```$ python3 crawaldata.py``` to make sure data crawling works

2. Create your own testing data and save it as ```processed/data.csv``` using the same structure as of ```processed/scraped.csv```. 

![Screenshot 2023-03-16 014014](https://user-images.githubusercontent.com/54694766/228060450-1c657372-08d7-41cf-b304-af291a6101e4.png)

<img width="188" alt="image" src="https://user-images.githubusercontent.com/54694766/228059942-d5662acf-14f2-4a91-8772-0bc83d7667ac.png">

3. Modify the code in ```embedText.py``` to read csv file ```processed/data.csv``` instead of ```processed/scraped.csv```.

<img width="501" alt="image" src="https://user-images.githubusercontent.com/54694766/228060086-213d5f85-beed-4afc-aabf-605ad3b2d60a.png">

4. Run ```$ python3 embedText.py``` to embed the data.

5. Run ```$ flask run``` to test the project by asking questions about the testing data in browser. 

<img width="481" alt="Screenshot 2023-03-19 211449" src="https://user-images.githubusercontent.com/54694766/228060541-47a04fdb-185f-474f-9de5-4954b2c27f6c.png">

6. Once the project is working as desired, link your payment method on OpenAI and embed ```processed/scraped.csv``` then test project with ```$ flask run```.
