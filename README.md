# ING Visya - ATM search API

### System Dependencies:
1. Node latest LTS
2. NPM Latest LTS

### Setup Steps:
1. Clone the repo
2. Run install command to install the dependencies
    ```
        npm install
    ```
3. Run the migration to load the data
    ```
        npm run load
    ```
4. Run selected command to start application

    Dev for auto detection to restart the app services
    ```
        npm run dev
    ```
5. Run the test command for unit testing
    ```
        npm test
    ```


***Note:*** Application env configurations:
1. **.env** *(/)* : standard application environmental configuration values
2. **lang.config,js** *(/configs/)* : Text messages during API resp


### Configur Postman:
1. Load environment file *(\postman\DEV-ENV.postman_environment.json)* and *(\postman\ingVysya.postman_collection.json)* in to postman collections by clicking on *import* option.