#include <ArduinoWebsockets.h>
#include <WiFi.h>
#include <ESP32Servo.h> 

const char* ssid = "VegaNarvaez-2024";
const char* password = "Aa12345678!";

using namespace websockets;
WebsocketsClient client;

int ledVerde = 14;
int ledRojo = 25;

Servo porton;
Servo puerta;

void onMessageCallback(WebsocketsMessage message) {
  Serial.print("Mensaje recibido: ");
  Serial.println(message.data());

  //Porton

  if (message.data().equals("porton")) {
    Serial.println("Activando el porton...");
    digitalWrite(ledRojo, LOW);    
    digitalWrite(ledVerde, HIGH);  
    porton.write(120);              
    delay(10000);                  
    porton.write(0);              
    digitalWrite(ledVerde, LOW);   
    digitalWrite(ledRojo, HIGH);  
  }

  //Puerta

   if (message.data().equals("puerta")) {
    Serial.println("Activando la puerta...");
    digitalWrite(ledRojo, LOW);    
    digitalWrite(ledVerde, HIGH);  
    puerta.write(120);              
    delay(10000);                  
    puerta.write(0);              
    digitalWrite(ledVerde, LOW);   
    digitalWrite(ledRojo, HIGH);  
  }


}


void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println("Conectando a WiFi...");
  }

  Serial.println("Conectado a WiFi");

  client.onMessage(onMessageCallback);

  if(client.connect("ws://192.168.1.26:8080/ws/servo")) {  
    Serial.println("Conectado al WebSocket");
  } else {
    Serial.println("No se pudo conectar al WebSocket");
  }

  pinMode(ledVerde, OUTPUT);
  pinMode(ledRojo, OUTPUT);
  digitalWrite(ledVerde, LOW);  
  digitalWrite(ledRojo, HIGH);

  //Porton  
  porton.attach(26);
  porton.write(0); 

  //Puerta
  puerta.attach(17);
  puerta.write(0);

}

void loop() {
  if (!client.available()) {  
    Serial.println("Reconectando al WebSocket...");
    if(client.connect("ws://192.168.1.26:8080/ws/servo")) {  
      Serial.println("Reconectado al WebSocket");
    } else {
      Serial.println("Fallo la reconexión");
    }
  }

  client.poll(); 
}
