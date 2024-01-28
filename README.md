# SparkGO
Projektet syftar till att skapa en användarvänlig tjänst där användare kan hyra sparkcyklar genom en mobilapp. Administratörer får en fullständig översikt över alla aktuella städer och sparkcyklar via en webbsida, och leverantörer har en enkel mekanism för att identifiera och hantera cyklar som behöver service. Målet är att erbjuda ett komplett system för sparkcykel uthyrning som möter användarbehov, administrativa krav och leverantörsbehov.

## Språk
- nodejs
- Reactjs - Vite
- Python
- Mariadb

## Teknologival
- MapBox
- Stripe Payments
- Leaflet
- Websockets
- Scrutinizer
- Docker


## Starta Systemet

För att starta systemet så ska du ha först:
- Installerat och configurerat docker
- skapa / hämta stripe API Nyckel
- skapa / hämta mapbox API Nyckel

### Skapa .env Filerna:
För att applikationen ska fungera, måste vi ha en .env fil i webapp och backend delarna.
#### Skapa .env i Backend
Gå in till backend
``` bash
# root folder

cd backed
```
skapa .env filen och lägg till följande variabler:
``` bash
# backend/
touch .env
```

``` env
# .env

DB_HOST=mariadb
DB_USER=dbadm
DB_PASSWORD=P@ssw0rd
DB_DATABASE=sparkgo
SESSION_SECRET= mySuperSecretKey12345!

STIPE_SECRET_KEY= [STRIPE_SECRET]
STIPE_PUBLIC_KEY=[STRIPE_PUBLIC]

```
#### Skapa .env i Webapp
``` bash
# root folder

cd webapp
```
skapa .env filen och lägg till följande variabler:
``` bash
# webapp/
touch .env
```

``` env
# .env

VITE_MAPBOX_KEY=[MAPBOX_KEY]
VITE_WS_URL=ws://localhost:3000
VITE_API_URL=http://localhost:3000/v1

```

## Köra med Docker
### Du kan köra systemet med bara 2 kommando - så enkelt!

```
# root foler
docker-compose build

# vänta tills docker bilden skapas

docker-compose up

# nu ska det fungera. testa att gå in på
http://localhost:8080
```

## Simulationen
Vi har två olika simulation python filer.
- vehicle.py: Simulera tusentals Sparkcyklar.
- user.py: Simulera tusentals användare som interagerar med systemet.

För att starta de: gå in på /vehicles mappen
``` bash
cd vehicles
sudo apt-get update
pip install -r requirements.txt

# starta vehicle
python3 vehicle.py

# starta en annan terminal

python3 user.py
```

