```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.js
```


/* Note
As I am stoing URL of Image in database but not on block,As I am storing only Image Id on Blockchain and deleting from ID only,but it become difficult to fetch data as My Display.js file fetching data from blockchain only here is the issue...
*/

</hr></hr>

# Blockchain Process

**-------------------------------------------------- start ----------------------------------------------------**

**-----> Automate   Installation of all file will be as follows** 
                                                                **↩**
## step 1 : clone the github file using :
```
git clone https://github.com/manojpisepatil/final-project.git
```
## step 2 : open powershel cmd
```
 ./setup.ps1
```
## It is one time process and if we try to run above same files then it gives error so , Unblock the Script File
```
Unblock-File -Path .\setup.ps1
```
**-------------------------------------------------- end ----------------------------------------------------**

**-----> Manual  Installation of all file will be in the blockchain folder " final-project "**


## Terminal 1
```
1. winget install OpenJS.NodeJS   --->  give permission "y"
2. Set-ExecutionPolicy RemoteSign -scope currentuser
3. npm install -save -dev hardhat
4. npx init -y 
5. npm install
6. npx hardhat node --->  give permission "y"
``` 

## Terminal 2
```
1. npx hardhat run --network localhost scripts/deploy.js
2. cd .\client\
3. npm install
4. npm start
```
