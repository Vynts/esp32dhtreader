#include <WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>

#define DHTPIN 15
#define DHTTYPE DHT22

const char* ssid = "FR-SYSTEM";
const char* password = "bebekgoreng";
const char* mqtt_server = "34.214.183.82";

WiFiClient espClient;
PubSubClient client(espClient);
DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);
  dht.begin();
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    Serial.print("\n Menyambungkan ke WIFI..");
    delay(3000);
  }
  Serial.print("\n Terhubung ke WIFI!");

  client.setServer(mqtt_server, 1883);
  while (!client.connected()) {
    if (client.connect("ESPClient","user123","pass123")) {
      Serial.print("\n Terhubung ke MQTT");
    } else {
      Serial.print("\nGagal Terhubung ke MQTT");
      Serial.print(client.state());
      delay(3000);
    }
  }
}

void loop() {
  float suhu = dht.readTemperature();
  float kelembapan = dht.readHumidity();

  if (!isnan(suhu) && !isnan(kelembapan)) {
    Serial.print("\n");
    String payload = "{\"suhu\":"+ String(suhu) +",\"kelembapan\":"+ String(kelembapan) +"}";
    client.publish("sensor/data", payload.c_str(), true);
    Serial.print(payload);
  }
  delay(5000);
}