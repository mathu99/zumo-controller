/* Arduino code to interact with Zumo - controlled from zumo-controller.herokuapp.com */

#define CUSTOM_SETTINGS
#define INCLUDE_INTERNET_SHIELD
#define INCLUDE_TERMINAL_SHIELD

#include <OneSheeld.h>
#include <ZumoShield.h>
#include <string.h>

HttpRequest apiRequest("https://zumo-controller.herokuapp.com/api/zumoControls?zumoId=1");  /* Zumo API Request */
ZumoBuzzer buzzer;
ZumoMotors motors;

const int LED_PIN = 13;
unsigned char currentIdx;
int currentSong = 0;
int speed = 200;  /* Zumo Speed */

#define MELODY_LENGTH1 95

// These arrays take up a total of 285 bytes of RAM (out of a limit of 1k (ATmega168), 2k (ATmega328), or 2.5k(ATmega32U4))
unsigned char note[MELODY_LENGTH1] =
{
  NOTE_E(5), SILENT_NOTE, NOTE_E(5), SILENT_NOTE, NOTE_E(5), SILENT_NOTE, NOTE_C(5), NOTE_E(5),
  NOTE_G(5), SILENT_NOTE, NOTE_G(4), SILENT_NOTE,

  NOTE_C(5), NOTE_G(4), SILENT_NOTE, NOTE_E(4), NOTE_A(4), NOTE_B(4), NOTE_B_FLAT(4), NOTE_A(4), NOTE_G(4),
  NOTE_E(5), NOTE_G(5), NOTE_A(5), NOTE_F(5), NOTE_G(5), SILENT_NOTE, NOTE_E(5), NOTE_C(5), NOTE_D(5), NOTE_B(4),

  NOTE_C(5), NOTE_G(4), SILENT_NOTE, NOTE_E(4), NOTE_A(4), NOTE_B(4), NOTE_B_FLAT(4), NOTE_A(4), NOTE_G(4),
  NOTE_E(5), NOTE_G(5), NOTE_A(5), NOTE_F(5), NOTE_G(5), SILENT_NOTE, NOTE_E(5), NOTE_C(5), NOTE_D(5), NOTE_B(4),

  SILENT_NOTE, NOTE_G(5), NOTE_F_SHARP(5), NOTE_F(5), NOTE_D_SHARP(5), NOTE_E(5), SILENT_NOTE,
  NOTE_G_SHARP(4), NOTE_A(4), NOTE_C(5), SILENT_NOTE, NOTE_A(4), NOTE_C(5), NOTE_D(5),

  SILENT_NOTE, NOTE_G(5), NOTE_F_SHARP(5), NOTE_F(5), NOTE_D_SHARP(5), NOTE_E(5), SILENT_NOTE,
  NOTE_C(6), SILENT_NOTE, NOTE_C(6), SILENT_NOTE, NOTE_C(6),

  SILENT_NOTE, NOTE_G(5), NOTE_F_SHARP(5), NOTE_F(5), NOTE_D_SHARP(5), NOTE_E(5), SILENT_NOTE,
  NOTE_G_SHARP(4), NOTE_A(4), NOTE_C(5), SILENT_NOTE, NOTE_A(4), NOTE_C(5), NOTE_D(5),

  SILENT_NOTE, NOTE_E_FLAT(5), SILENT_NOTE, NOTE_D(5), NOTE_C(5)
};

unsigned int duration[MELODY_LENGTH1] =
{
  100, 25, 125, 125, 125, 125, 125, 250, 250, 250, 250, 250,

  375, 125, 250, 375, 250, 250, 125, 250, 167, 167, 167, 250, 125, 125,
  125, 250, 125, 125, 375,

  375, 125, 250, 375, 250, 250, 125, 250, 167, 167, 167, 250, 125, 125,
  125, 250, 125, 125, 375,

  250, 125, 125, 125, 250, 125, 125, 125, 125, 125, 125, 125, 125, 125,

  250, 125, 125, 125, 250, 125, 125, 200, 50, 100, 25, 500,

  250, 125, 125, 125, 250, 125, 125, 125, 125, 125, 125, 125, 125, 125,

  250, 250, 125, 375, 500
};

void setup() {
  OneSheeld.begin();
  Terminal.println("Initializing requests to Zumo-Controller...");
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, HIGH); /* Start setup */
  apiRequest.setOnSuccess(&onApiSuccess); /* Subscribe to success callback for the request. */
  apiRequest.getResponse().setOnJsonResponse(&onApiReply);  /* Subscribe to json value replies. */
  apiRequest.getResponse().setOnError(&onResponseError);
  Internet.setOnError(&onInternetError); 
  digitalWrite(LED_PIN, LOW); /* End setup */
  Terminal.println("Initialized!");
}

void loop() {
  Internet.performGet(apiRequest);
}

void onCoordsSuccess(HttpResponse & response) {
  response["coordinates"].query();  /* Get gamma|beta from phone */ 
}

void onCoordsReply(JsonKeyChain & hell, char * output) {
  Terminal.println(output);
  int gamma, beta;
  sscanf(output, "%d|%d", &gamma, &beta);
  if (beta == -1) {  //Forward
    motors.setSpeeds(speed, speed);
  } else if (beta == 1) { //Reverse
    motors.setSpeeds(-speed, -speed);
  } else if (gamma == -1) { //Left
    motors.setSpeeds(-speed/2, speed/2);
  } else if (gamma == 1) { //Right
    motors.setSpeeds(speed/2, -speed/2);
  } else {
    motors.setSpeeds(0, 0);
  }  
}

void onApiSuccess(HttpResponse & response) {
  response["zumoControls"].query();  /* Play/pause the selected track */ 
}

void onApiReply(JsonKeyChain & hell, char * output) {
  int gamma, beta, currentSong;
  sscanf(output, "%d|%d|%d|%d", &currentSong, &gamma, &beta, &speed);

  if (currentIdx < MELODY_LENGTH1 && !buzzer.isPlaying() && currentSong == 1)
  {
    Terminal.println("play note");
    buzzer.playNote(note[currentIdx], duration[currentIdx], 15);
    currentIdx++;
  }

  if (currentSong == 0)
  {
    buzzer.stopPlaying(); // silence the buzzer
    if (currentIdx < MELODY_LENGTH1)
      currentIdx = MELODY_LENGTH1;        // terminate the melody
    else
      currentIdx = 0;                    // restart the melody
  }
}

void onResponseError(int errorNumber) { /* Generic Resposne Error Handler */
  Terminal.print("Response error:");
  switch(errorNumber) {
    case INDEX_OUT_OF_BOUNDS: Terminal.println("INDEX_OUT_OF_BOUNDS");break;
    case RESPONSE_CAN_NOT_BE_FOUND: Terminal.println("RESPONSE_CAN_NOT_BE_FOUND");break;
    case HEADER_CAN_NOT_BE_FOUND: Terminal.println("HEADER_CAN_NOT_BE_FOUND");break;
    case NO_ENOUGH_BYTES: Terminal.println("NO_ENOUGH_BYTES");break;
    case REQUEST_HAS_NO_RESPONSE: Terminal.println("REQUEST_HAS_NO_RESPONSE");break;
    case SIZE_OF_REQUEST_CAN_NOT_BE_ZERO: Terminal.println("SIZE_OF_REQUEST_CAN_NOT_BE_ZERO");break;
    case UNSUPPORTED_HTTP_ENTITY: Terminal.println("UNSUPPORTED_HTTP_ENTITY");break;
    case JSON_KEYCHAIN_IS_WRONG: Terminal.println("JSON_KEYCHAIN_IS_WRONG");break;
  }
}

void onInternetError(int requestId, int errorNumber) { /* Generic Internet Error Handler */
  Terminal.print("Request id:");
  Terminal.println(requestId);
  Terminal.println(errorNumber);
  switch(errorNumber) {
    case REQUEST_CAN_NOT_BE_FOUND: Terminal.println("REQUEST_CAN_NOT_BE_FOUND");break;
    case NOT_CONNECTED_TO_NETWORK: Terminal.println("NOT_CONNECTED_TO_NETWORK");break;
    case URL_IS_NOT_FOUND: Terminal.println("URL_IS_NOT_FOUND");break;
    case ALREADY_EXECUTING_REQUEST: Terminal.println("ALREADY_EXECUTING_REQUEST");break;
    case URL_IS_WRONG: Terminal.println("URL_IS_WRONG");break;
  }
}
