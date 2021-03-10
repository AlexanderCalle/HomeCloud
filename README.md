# HomeCloud

HomeCloud is a open source local cloud for a safer way to store all your files. More and more don't trust the big tech companies ith their data, the solution is HomeCloud.

## Getting Started

These instructions will get you a copie if this poject so you can use it on your local machine.

### Prerequisites

What you need to install the software and how to install them

Mysql

To install mysql go to the site and install recommended version/ latest version and follow the instruction, make sure you have a secure password. To check if it is installed, in the console type: mysql -V

NodeJs

Go to the node.js site and install the recommended version and follow along with the installer, make sure you install npm as well. To check bouth software type this in the console: node -v and npm -v

Git

For git go as well to the site and install  the recommended version and follow along with the installer. Check with: git —version

### Installing

A step by step guide that tells you how to get HomeCloud on your machine

Pulling the code to a folder named HomeCloud:

```
git pull https://github.com/AlI230/HomeCloud.git
```

Initialize mysql for the site:

Log in to mysql

```
c:/user/name> mysql --user=root --passsword
```

You are now in the mysql command line

Create a database named "HomeCloud"

```
mysql> CREATE DATABASE HomeCloud;
```

You have now the database, lets create the tables

```
mysql> user HomeCloud;
mysql> source path/to/HomeCloud/db/init.sql;
```

Now your database is almost done, one thing left. Go to your folder with this project and then to de backend folder. Inside the connect.js change the password to your mysql password.

```javascript
const con = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'yourpasswordhere', <--
    database: 'HomeCloud'
});
```

There are two things left to do before you can start the service.

First install packages inside the frontend and backend folder.

```
path/to/folder/backend> npm install
path/to/folder/fronted> npm install
```

Finaly last stap to do, bit complicater than the rest, follow along well.

In the backend folder create a file called .env and add the following variables

```
UPLOAD_FOLDER = /
SENDGRID_API_KEY='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'
```

In the frontend folder also create a file calles .env

First go to your console and type (Windows / Ubuntu)

```
C://user/name> ipconfig
```

Search for the IP4v adress expample: 192.168.223.12

Then go back to .env file in the frontend folder and add thge following

```
REACT_APP_HOST_IP=(IP4v you just have found)
```

## Running The Server

To run the service do the following

First run the backend server

```
path/to/folder/backend> nodemon
```

For the frontend server run:

```
path/to/folder/frontend> npm run start
```

You can view the cloud / site on the andress:

```
http://(IPv4 you found):3000/
```

## Built With

* [React.js](https://reactjs.org) - The frontend framework used
* [Express.js](https://expressjs.com/) - The web framework for Node.js
* [Node.js](https://nodejs.org/en/) - Javascript runtime built
* [Mysql](https://www.mysql.com/) - Database service

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## Authors

* **Alexander Callebaut** - *Initial work* - [Ali230](https://github.com/AlI230)

## License

This project is licensed under the MIT License - see [MIT](https://choosealicense.com/licenses/mit/) for details