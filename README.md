
<h2 align="center">Safety Event Promocodes</h2>

<p>Boda Ride Safety event Promo codes generator and validator api. For all codes generated they can be used within a specific radius to the event venue.</p>

#### Installation
Clone repo `git clone https://github.com/ruyonga/SafetyPromo.git`


Install nodejs 10.1.0 , npm and mongodb  services 
Change directory to safetyPromo

Install needed libraries via npm

```bash
$ npm install
```

Start local development sever
```bash
$ nodemon 
$ node server.js
```


<h4>Api</h4>

#### Endpoints
```bash
| Domain | Method    | URI                              |
|--------|-----------|------------------------------    |
|        | GET|HEAD  | api/v1/promocode                 |
|        | POST      | api/v1/promocode                 |
|        | GET|HEAD  | api/v1/getActiveCodes            |
|        | POST      | api/v1/promocode/validate        |
|        | POST      | api/v1/promocode/updateAll       |
|        | PUT|PATCH | api/v1//promocode/status/:id     |
|        | POST      | api/v1/auth/register             |
|        | POST      | api/v1/auth/login     
|
```

#### DESCRIPTION

<ul>
ALL endpoints require and header acess  token, obtain one by registering/login
 <li>Register to get an auth token<li/>
    <a>http://127.0.0.1:4000/api/v1/auth/register/</a>
  
```bash
    {  "name":"Droider" , "email":"test@sb.com", "password":"IAmAPassWOrd" }
```

<li> Generate code (POST)</li>
     http://127.0.0.1:4000/api/v1/promocode/
    <p>Returns all the codes in the databases</p>
  
First generate X number(codenum) of codes
When generating code, provide the venue name, lat, and long and radius 

```bash
    { 
    value: '5000',
    expirydate: '2019-02-02',
    codenum: '10',
    radius: '2000',
    address: 'Makerere Hill Road, Kampala, Uganda',
    lat: '0.327963',
    lng: '32.568976' }
```

<li> Get All Codes(GET)</li>
    http://127.0.0.1:4000/api/v1/promocode/
    <p>Returns all the codes in the databases</p>

    
<li>The Challenge</li>
    http://127.0.0.1:4000/api/v1/promocode/validate 
     
```bash
     {
        'code': 'YYeBi4u',
         'origin': 'Mutungo',
         'destination': 'Makerere Hill Road'
        }

```
<p>Response</p>

  ```bash  
    { 
    origin: { origin: 'Mutungo', coordinates: [ 0.2099164, 32.5726239 ] },
    destination: { coordinates: [ 0.3279629, 32.5689763 ] },
    event:{ address: 'Makerere Hill Road, Kampala, Uganda',
                    coordinates: [ 0.327963, 32.568976 ] },
    active: true,
    expired: false,
    _id: 5b75cbc107f8fa28197de28d,
    code: 'YYeBi4u',
    value: 1000,
    radius: 2000,
    expirydate: 2018-09-07T21:00:00.000Z,
    polyline: '__h@{yxeEy`VxU' }
```

<li>Get Active Codes</li>
    http://127.0.0.1:4000/api/v1/getactivecodes

<p>Returns an object of all active codes.</>
     
</ul>

### EXTRAS

<p>Visually test the api using the POSTMAN or ADVANCEDREST CLIENT.
<p> I have develped a laravel frontend for api to visually test the end points 
clone it: <a href="https://github.com/ruyonga/SafetyPromo-Laravel.git"> <h4>Laravel as a Frontend </h4></a>
