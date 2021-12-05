# About

This app visualizes the sensor data from phones in browser

# Installations

- clone this repo from https://github.com/someGoodBits/sensor-data-visualization
- run ```run npm install``` to install all the dependencies
- download openSSL
- for more info on generating a self-signed ssl certificate checkout this website https://www.ibm.com/docs/en/api-connect/5.0.x?topic=profiles-generating-self-signed-certificate-using-openssl
- copy the path of .key and .pem file into .env file
- put the pass phrase used during generation of the certificate into the .env file
- run the app with ```npm start``` or ```npm run dev```

# Usage
- goto https://localhost:3000/dashboard for the dashboard
- connect a phone on same network as the computer
- visit https://{ip-of-pc}:3000 on your phone
- connected device will show up in dashboard
- select connected device according to id and the sensor data will be displayed on the dashboard