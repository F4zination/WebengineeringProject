# Read Me Beeportal

Das Beeportal ist eine Website auf der mehrere Imker jeweils ihre Bienenstock-Karten übersichtlich darstellen können. Jeder Imker hat einen eigenen Benutzername und ein Password. Es können nach belieben neue Nutzer hinzugefügt werden. Die Stockkarten werden in einer Datenbank gespeichert und können erstellt, modifiziert und auch, wenn diese nicht mehr gebraucht werden, gelöscht werden.

## Was vorab zu tun ist
- Installiere [Node.js](https://nodejs.org/de/) >= Version 8.0.0
- Installiere [Xampp](https://www.apachefriends.org/de/download.html) > Version 8.0


## Aufsetzten des Webservers und des Datenbankservers
- Clonen Sie das Repo oder entpacken Sie die ZIP-Datei auf ihrem PC
```
git clone  https://github.com/F4zination/WebengineeringProject.git
```
- Installieren Sie alle dependencies
```
cd Website
npm install
```
- starten Sie den Webserver
```
npm start
```
- öffnen Sie XAMPP
- starten Sie den Webserver und auch die Datenbank
- öffnen sie [phpMyAdmin](http://localhost/phpmyadmin/index.php)
- importieren Sie die *webengineeringDataBase.sql* aus dem Ordner Doku/DataBase in eine neue Datenbank mit dem Name *"webengineering"*

## Aufrufen der Website

-  Öffnen Sie im Browser `http://localhost:3000`


## Fehlerquellen

- Wenn ein SQL-Fehler kommt, dann kann es daran liegen, dass Sie nicht das richtige Password für ihren SQL-Nutzer gesendet haben. Um diesen Fehler zu beheben schreiben Sie bitten ihren Nutzer und das zugehörige Password in der *app.js* in den Zeilen 13 und 14.