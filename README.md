# ChatWithSockets
For Client/Server Class

You can find two folders in this project which contain the files to run the chat, one was code with Freddy's computer and the other with Carlos'.

You need to install Node.js, npm and mongodb in order to run the chats

#### **Node.js and NPM**

<u>**Windows**</u>

Download the latest Node.js that contains npm package manager

https://nodejs.org/en/download/

**<u>Linux Ubuntu</u>**

```sh
$ curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
$ sudo apt-get install -y nodejs
```

**<u>OSX</u>**

```sh
$ curl "https://nodejs.org/dist/latest/node-${VERSION:-$(wget -qO- https://nodejs.org/dist/latest/ | sed -nE 's|.*>node-(.*)\.pkg</a>.*|\1|p')}.pkg" > "$HOME/Downloads/node-latest.pkg" && sudo installer -store -pkg "$HOME/Downloads/node-latest.pkg" -target "/"
```



#### **mongodb**

**<u>Windows</u>**

Download the latest community server

https://www.mongodb.com/download-center?jmp=docs&_ga=1.76523728.418016748.1486603247#community

And robomongo

https://robomongo.org/

**<u>Linux</u>**

```sh
$ echo "deb [ arch=amd64,arm64 ] http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.4.list

$ sudo apt-get update

$ sudo apt-get install -y mongodb-org

$ sudo service mongod start
```

**<u>OSX</u>**

```sh
$ brew update

$ brew install mongodb
```



Now that we have everything we can go to either folders and type the following code in your bash in order to run the application.

```bash
$ npm install
$ node app.js
```



