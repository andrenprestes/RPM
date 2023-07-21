#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include <math.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <Wire.h>
#include <regex>
#include "time.h"

#define API_KEY //Necessario
#define FIREBASE_PROJECT_ID //Necessario
#define USER_EMAIL //Necessario
#define USER_PASSWORD //Necessario
#define IDPATIENT 10

const char* ssid = ;//Necessario
const char* password = ;//Necessario

const char* ntpServer = "pool.ntp.org";
const long  gmtOffset_sec = 0;
const int   daylightOffset_sec = 3600;

const int analogInPin = A0;     // Analog input pin connected to AD8232 OUTPUT
const int lowPlusPin = 4;      // GPIO pin connected to AD8232 Low+ mode selection
const int lowMinusPin = 2;     // GPIO pin connected to AD8232 Low- mode selection

Adafruit_MPU6050 mpu;

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;


void FirestoreTokenStatusCallback(TokenInfo info){
  Serial.printf("init\n");
}

void firebaseInit(){
  config.api_key = API_KEY;

  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;

  config.token_status_callback = FirestoreTokenStatusCallback;

  Firebase.begin(&config, &auth);
}


int fireStoreGetIndexData(){
  int index=0;
  String documentPath = "numData/0";
  String mask = "num";

  if (Firebase.Firestore.getDocument(&fbdo, FIREBASE_PROJECT_ID, "", documentPath.c_str(), mask.c_str())){
    std::string s = fbdo.payload().c_str();
    std::regex rgx(R"(integerValue....(\d*))");
    std::smatch match;
    if(std::regex_search(s, match, rgx)){
        auto output = match[0].str();
        return atoi(output.substr(16).c_str());
    }
  }
  else
      Serial.println(fbdo.errorReason());

  return index;
}

int fireStoreGetIndex(){
  int index=0;
  String documentPath = "numData/0";
  String mask = "numAce";

  if (Firebase.Firestore.getDocument(&fbdo, FIREBASE_PROJECT_ID, "", documentPath.c_str(), mask.c_str())){
    std::string s = fbdo.payload().c_str();
    std::regex rgx(R"(integerValue....(\d*))");
    std::smatch match;
    if(std::regex_search(s, match, rgx)){
        auto output = match[0].str();
        return atoi(output.substr(16).c_str());
    }
  }
  else
      Serial.println(fbdo.errorReason());

  return index;
}

int getDayOfMonth(int mes){
  switch(mes){
    case 1:
      return 31;
      break;
    case 2:
      return 28;
      break;
    case 3:
      return 31;
      break;
    case 4:
      return 30;
      break;
    case 5:
      return 31;
      break;
    case 6:
      return 30;
      break;
    case 7:
      return 31;
      break;
    case 8:
      return 31;
      break;
    case 9:
      return 30;
      break;
    case 10:
      return 31;
      break;
    case 11:
      return 30;
      break;
    case 12:
      return 31;
      break;
    
  }
}

String printLocalTime(){
  struct tm timeinfo;
  if(!getLocalTime(&timeinfo)){
    Serial.println("Failed to obtain time");
    String e ="Failed to obtain time";
    return e;
  }
  char timestamp[31];
  String s;

  int month = timeinfo.tm_mon + 1;
  if (timeinfo.tm_hour -4 >= 0)
    s = String(timeinfo.tm_year+1900) + "-" + String(month) + "-" + String(timeinfo.tm_mday) + "T" + String(timeinfo.tm_hour-4) + ":" + String(timeinfo.tm_min) + ":" + String(timeinfo.tm_sec) + "Z"; 
  else 
    if (timeinfo.tm_mday - 1 > 0)
      s = String(timeinfo.tm_year+1900) + "-" + String(month) + "-" + String(timeinfo.tm_mday-1) + "T" + String(24 + (timeinfo.tm_hour-4) ) + ":" + String(timeinfo.tm_min) + ":" + String(timeinfo.tm_sec) + "Z"; 
    else
      if (month - 1 > 0)
        s = String(timeinfo.tm_year+1900) + "-" + String(month-1) + "-" + String(getDayOfMonth(month-1)) + "T" + String(24 + (timeinfo.tm_hour-4) ) + ":" + String(timeinfo.tm_min) + ":" + String(timeinfo.tm_sec) + "Z"; 
      else
      s = String(timeinfo.tm_year -1+1900) + "-" + String(12) + "-" + String(getDayOfMonth(12)) + "T" + String(24 + (timeinfo.tm_hour-4) ) + ":" + String(timeinfo.tm_min) + ":" + String(timeinfo.tm_sec) + "Z"; 
        
  Serial.println(s);
  Serial.println();
  return s;
}
void fireStoreUpdateIndex(int index){
  if(WiFi.status() == WL_CONNECTED && Firebase.ready()){
    FirebaseJson content;
    String documentPath = "numData/0";

    content.set("fields/numAce/integerValue", String(index+1).c_str());

    if(Firebase.Firestore.patchDocument(&fbdo, FIREBASE_PROJECT_ID, "", documentPath.c_str(), content.raw(), "numAce")){
      return;
    }else{
      Serial.println(fbdo.errorReason());
    }
  }
}

void fireStoreUpdateIndexData(int index){
  if(WiFi.status() == WL_CONNECTED && Firebase.ready()){
    FirebaseJson content;
    String documentPath = "numData/0";

    content.set("fields/num/integerValue", String(index+1).c_str());

    if(Firebase.Firestore.patchDocument(&fbdo, FIREBASE_PROJECT_ID, "", documentPath.c_str(), content.raw(), "num")){
      return;
    }else{
      Serial.println(fbdo.errorReason());
    }
  }
}

void firestoreDataUpdateAcele(double Ax, double Ay, double Az, double Rx, double Ry, double Rz){
  if(WiFi.status() == WL_CONNECTED && Firebase.ready()){
    FirebaseJson content;
    int index = fireStoreGetIndex();
    String time = printLocalTime();
    //Serial.println(time);
    String documentPath = "acelerometro/"+String(index);
    //Serial.println(index);

    content.set("fields/id/doubleValue", String(index).c_str());
    content.set("fields/idPatient/doubleValue", String(IDPATIENT).c_str());
    content.set("fields/AcX/doubleValue", String(Ax).c_str());
    content.set("fields/Acy/doubleValue", String(Ay).c_str());
    content.set("fields/Acz/doubleValue", String(Az).c_str());
    content.set("fields/RotX/doubleValue", String(Rx).c_str());
    content.set("fields/Roty/doubleValue", String(Ry).c_str());
    content.set("fields/dates/stringValue", String(time).c_str());
    content.set("fields/Rotz/doubleValue", String(Rz).c_str());

    if(Firebase.Firestore.createDocument(&fbdo, FIREBASE_PROJECT_ID, "", documentPath.c_str(), content.raw())){
      // Serial.printf("ok\n%s\n\n", fbdo.payload().c_str());
      fireStoreUpdateIndex(index);
      return;
    }else{
      Serial.println(fbdo.errorReason());
    }
  }
}


void firestoreDataUpdateHeart(double data){
  if(WiFi.status() == WL_CONNECTED && Firebase.ready()){
    FirebaseJson content;
    int index = fireStoreGetIndexData();
    String documentPath = "sensorsData/"+String(index);
    //Serial.println(index);
    String time = printLocalTime();
    //Serial.println(time);

    content.set("fields/id/doubleValue", String(index).c_str());
    content.set("fields/idPatient/doubleValue", String(IDPATIENT).c_str());
    content.set("fields/idSensor/doubleValue", String(3).c_str());
    content.set("fields/label/stringValue", String("Heart Beat").c_str());
    content.set("fields/data/doubleValue", String(data).c_str());
    content.set("fields/dates/stringValue", String(time).c_str());

    if(Firebase.Firestore.createDocument(&fbdo, FIREBASE_PROJECT_ID, "", documentPath.c_str(), content.raw())){
      // Serial.printf("ok\n%s\n\n", fbdo.payload().c_str());
      fireStoreUpdateIndexData(index);
      return;
    }else{
      Serial.println(fbdo.errorReason());
    }
  }
}

void readAce() {
  /* Get new sensor events with the readings */
  sensors_event_t a, g, temp;
  mpu.getEvent(&a, &g, &temp);
  delay(500);
  firestoreDataUpdateAcele(a.acceleration.x, a.acceleration.y, a.acceleration.z, g.gyro.x, g.gyro.y, g.gyro.z);
}


void setup(){
    Serial.begin(9600);
    delay(1000);

    WiFi.mode(WIFI_STA);
    WiFi.begin(ssid, password);
    Serial.println("\nConnecting");

    while(WiFi.status() != WL_CONNECTED){
        Serial.print(".");
        delay(100);
    }
    firebaseInit();
    configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);

    pinMode(lowPlusPin, OUTPUT);
    pinMode(lowMinusPin, OUTPUT);
    digitalWrite(lowPlusPin, HIGH);     // Select Low+ mode
    digitalWrite(lowMinusPin, LOW);     // Select Low- mode

    
  while (!Serial)
    delay(10); // will pause Zero, Leonardo, etc until serial console opens

  Serial.println("Adafruit MPU6050 test!");

  // Try to initialize!
  if (!mpu.begin()) {
    Serial.println("Failed to find MPU6050 chip");
    while (1) {
      delay(10);
    }
  }
  Serial.println("MPU6050 Found!");

  mpu.setAccelerometerRange(MPU6050_RANGE_8_G);
  Serial.print("Accelerometer range set to: ");
  switch (mpu.getAccelerometerRange()) {
  case MPU6050_RANGE_2_G:
    Serial.println("+-2G");
    break;
  case MPU6050_RANGE_4_G:
    Serial.println("+-4G");
    break;
  case MPU6050_RANGE_8_G:
    Serial.println("+-8G");
    break;
  case MPU6050_RANGE_16_G:
    Serial.println("+-16G");
    break;
  }
  mpu.setGyroRange(MPU6050_RANGE_500_DEG);
  Serial.print("Gyro range set to: ");
  switch (mpu.getGyroRange()) {
  case MPU6050_RANGE_250_DEG:
    Serial.println("+- 250 deg/s");
    break;
  case MPU6050_RANGE_500_DEG:
    Serial.println("+- 500 deg/s");
    break;
  case MPU6050_RANGE_1000_DEG:
    Serial.println("+- 1000 deg/s");
    break;
  case MPU6050_RANGE_2000_DEG:
    Serial.println("+- 2000 deg/s");
    break;
  }

  mpu.setFilterBandwidth(MPU6050_BAND_5_HZ);
  Serial.print("Filter bandwidth set to: ");
  switch (mpu.getFilterBandwidth()) {
  case MPU6050_BAND_260_HZ:
    Serial.println("260 Hz");
    break;
  case MPU6050_BAND_184_HZ:
    Serial.println("184 Hz");
    break;
  case MPU6050_BAND_94_HZ:
    Serial.println("94 Hz");
    break;
  case MPU6050_BAND_44_HZ:
    Serial.println("44 Hz");
    break;
  case MPU6050_BAND_21_HZ:
    Serial.println("21 Hz");
    break;
  case MPU6050_BAND_10_HZ:
    Serial.println("10 Hz");
    break;
  case MPU6050_BAND_5_HZ:
    Serial.println("5 Hz");
    break;
  }

  Serial.println("");
  delay(100);
}

void readHeart(){
  float rawValue = analogRead(analogInPin); 
  // Serial.println(rawValue);
  float voltage = rawValue * (3.3 / 4096.0);
  float vrms = voltage / sqrt(2);
  double heartRate = 60.0 / (1.0 + exp(1.2661 - 5.1699 * vrms));
  // Serial.println(heartRate);
  firestoreDataUpdateHeart(heartRate);
  delay(500);
}

void loop() {
  readHeart();
  readAce();
  delay(5000);
}





