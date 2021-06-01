const int analogInPin = A0;  // Inputul analogic pe care am pus microfonul

int sensorValue = 0;        // Variabila unde vom citi valoarea din senzor
int prevsensorValue = 0;

void setup() {
  // Citim la 9600 biti
  Serial.begin(9600); 
}

void loop() {
  // Intr-un loop infinit citim valoarea din microfon
  sensorValue = analogRead(analogInPin);

  int sensorValueInDB = (sensorValue+83.2073) / 11.003; // Formula de pe Google

  // Printam valoarea
  Serial.print(sensorValueInDB);
  
  // Facem delay ca sa nu spamam
  delay(100);                     
}
