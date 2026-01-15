# DRS_projekat

## Instalirati:
- pyenv (3.9)
- pipenv
- flask
- SQLAlchemy

## Endpoints:

### **GET** `/all_users`
Vraca json sa SAMO UserProfile podacima

### **DELETE** `/detelete/{id}`
Brise user ID

### **PUT** `/role/{id}`
Menja user role. Staviti role string u body form pod `role`.
Validni rolovi su `user`, `moderator`, `admin`

### **PUT** `/update_profile`
Staviti samo podatke koji se menjaju, ili sve. Kako god.
Updateuje profil za korisnika povezanog sa JWT tokenom
