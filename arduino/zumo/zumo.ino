/* Arduino code to interact with Zumo - controlled from zumo-controller.herokuapp.com */

#define CUSTOM_SETTINGS
#define INCLUDE_INTERNET_SHIELD
#define INCLUDE_TERMINAL_SHIELD

#include <OneSheeld.h>
#include <ZumoShield.h>
#include <string.h>

HttpRequest coordRequest("http://zumo-controller.herokuapp.com/api/currentCoords");  /* Zumo Navigation Request */
HttpRequest songRequest("http://zumo-controller.herokuapp.com/api/selectedTrackNumber");  /* Music to play on Buzzer Request */
ZumoBuzzer buzzer;
ZumoMotors motors;
const int SPEED = 400;  /* Zumo Speed */
const int LED_PIN = 13;
const int ZUMO_ID = 1; /* ID of Zumo to get actions for */

void setup() {
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, HIGH); /* Start setup */
  Terminal.println("Initializing requests to Zumo-Controller...");
  OneSheeld.begin();
  coordRequest.addParameter("zumoId", ZUMO_ID);
  coordRequest.setOnSuccess(&onCoordsSuccess); /* Subscribe to success callback for the request. */
  coordRequest.getResponse().setOnJsonResponse(&onCoordsReply);  /* Subscribe to json value replies. */
  coordRequest.getResponse().setOnError(&onResponseError);
  songRequest.addParameter("zumoId", ZUMO_ID);
  songRequest.setOnSuccess(&onSongSuccess); /* Subscribe to success callback for the request. */
  songRequest.getResponse().setOnJsonResponse(&onSongReply);  /* Subscribe to json value replies. */
  songRequest.getResponse().setOnError(&onResponseError);
  Internet.setOnError(&onInternetError); 
  Terminal.println("Initialized.");
  digitalWrite(LED_PIN, LOW); /* End setup */
}

void loop() {
  Internet.performGet(coordRequest);
  Internet.performGet(songRequest);
//  OneSheeld.delay(60000); /* 1 min */
}

void onCoordsSuccess(HttpResponse & response) {
  response["coordinates"].query();  /* Get gamma|beta from phone */ 
}

void onCoordsReply(JsonKeyChain & hell, char * output) {
  int gamma, beta;
  sscanf(output, "%d|%d", &gamma, &beta);
  if (beta == -1) {  //Forward
    motors.setSpeeds(SPEED, SPEED);
  } else if (beta == 1) { //Reverse
    motors.setSpeeds(-SPEED, -SPEED);
  } else if (gamma == -1) { //Left
    motors.setSpeeds(-SPEED/2, SPEED/2);
  } else if (gamma == 1) { //Right
    motors.setSpeeds(SPEED/2, -SPEED/2);
  } else {
    motors.setSpeeds(0, 0);
  }  
}

void onSongSuccess(HttpResponse & response) {
  response["trackNumber"].query();  /* Play/pause the selected track */ 
}

void onSongReply(JsonKeyChain & hell, char * output) {
  Terminal.println("onSongReply");
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
  Terminal.print("Internet error:");
  switch(errorNumber) {
    case REQUEST_CAN_NOT_BE_FOUND: Terminal.println("REQUEST_CAN_NOT_BE_FOUND");break;
    case NOT_CONNECTED_TO_NETWORK: Terminal.println("NOT_CONNECTED_TO_NETWORK");break;
    case URL_IS_NOT_FOUND: Terminal.println("URL_IS_NOT_FOUND");break;
    case ALREADY_EXECUTING_REQUEST: Terminal.println("ALREADY_EXECUTING_REQUEST");break;
    case URL_IS_WRONG: Terminal.println("URL_IS_WRONG");break;
  }
}
