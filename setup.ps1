# Step 0: Go to script's directory
cd "$PSScriptRoot"

# Step 1: Install Node.js using winget (if not already installed)
winget install OpenJS.NodeJS -h

# Step 2: Set execution policy (for running scripts)
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser -Force

# Step 3: Initialize project and install dependencies
npm init -y
npm install --save-dev hardhat
npm install

# Step 4: Start Hardhat node in a new PowerShell terminal (Terminal 1)
Start-Process powershell -ArgumentList "cd `"$PWD`"; npx hardhat node"

# Step 5: Wait for Hardhat node to start properly
Start-Sleep -Seconds 10

# Step 6: In new terminal (Terminal 2), deploy contracts and start frontend
Start-Process powershell -ArgumentList "cd `"$PWD`"; npx hardhat run --network localhost scripts/deploy.js; cd client; npm install; npm start"
