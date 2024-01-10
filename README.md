# scoreup-frontend

##Deploy
### Build
```
npm run build
npx parcel serve /dist/index.html
```
### Copy dist folder to Server
```
scp -r /source/dist/* account@101.96.66.219:/var/www/html/score-up
Ex:
scp -r /Users/mac/IdeaProjects/scoreup-frontend/dist/* codelab@101.96.66.219:/var/www/html/score-up
```
### Config Apache2
```
   ssh codelab@101.96.66.219
   ssh duyviet2101@101.96.66.219
   sudo nano /etc/apache2/sites-available/000-default.conf   
```
File config:
```
   <VirtualHost *:443>
    ServerName foliastudy.com
    DocumentRoot /var/www/html/folia/
    SSLEngine on
    SSLCertificateFile /etc/apache2/ssl/foliastudy/www_foliastudy_com.crt
    SSLCertificateKeyFile /etc/apache2/ssl/foliastudy/private.key
    SSLCACertificateFile /etc/apache2/ssl/foliastudy/My_CA_Bundle.ca-bundle
       
      <Directory "/var/www/html/folia">
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    Alias /exam "/var/www/html/score-up"
    <Directory "/var/www/html/score-up">
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    ProxyPass "/exam/api" "http://localhost:8020/"
    ProxyPassReverse "/exam/api" "http://localhost:8020/"
  
</VirtualHost>
```
Restart
```
sudo systemctl restart apache2
```