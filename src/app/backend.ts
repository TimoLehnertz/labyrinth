/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */


export interface paths {
  "/": {
    get: operations["AppController_getHello"];
  };
  "/users/register": {
    post: operations["UsersController_register"];
  };
  "/friends": {
    get: operations["FriendsController_getFriends"];
  };
  "/friends/friend": {
    delete: operations["FriendsController_deleteFriend"];
  };
  "/friends/send-requests": {
    get: operations["FriendsController_getSendFriendRequests"];
  };
  "/friends/received-requests": {
    get: operations["FriendsController_getFriendRequests"];
  };
  "/friends/request": {
    post: operations["FriendsController_addFriendRequest"];
    delete: operations["FriendsController_deleteFriendRequest"];
  };
  "/friends/ignore-request": {
    put: operations["FriendsController_ignoreFriendRequest"];
  };
  "/auth/login": {
    post: operations["AuthController_login"];
  };
  "/auth/profile": {
    get: operations["AuthController_getProfile"];
  };
  "/game": {
    get: operations["GameController_findOne"];
    put: operations["GameController_update"];
    post: operations["GameController_create"];
  };
  "/game/move": {
    post: operations["GameController_move"];
  };
  "/game/availableToJoin": {
    get: operations["GameController_findAvailableToJoin"];
  };
  "/game/players": {
    get: operations["GameController_findPlayers"];
  };
  "/game/ownGames": {
    get: operations["GameController_findOwnGames"];
  };
  "/game/join": {
    post: operations["GameController_join"];
  };
  "/game/addBot": {
    post: operations["GameController_addBot"];
  };
  "/game/ready": {
    put: operations["GameController_setReady"];
  };
  "/game/leave": {
    delete: operations["GameController_leaveGame"];
  };
  "/game/makeAdmin": {
    put: operations["GameController_makeAdmin"];
  };
}

export type webhooks = Record<string, never>;

export interface components {
  schemas: {
    RegisterDto: {
      username: string;
      email: string;
      password: string;
    };
    RegisterErrorResponse: {
      /** @enum {string} */
      message: "email taken" | "username taken";
    };
    User: {
      id: string;
      email: string;
      username: string;
      gamesWon: number;
      gamesLost: number;
    };
    Friendship: {
      id: string;
      usera: string;
      useraUser: components["schemas"]["User"];
      userb: string;
      userbUser: components["schemas"]["User"];
      /** Format: date-time */
      since: string;
    };
    DeleteFriendErrorResponse: {
      /** @enum {string} */
      message: "friendship does not exist";
    };
    FriendRequest: {
      id: string;
      initiator: string;
      initiatorUser: components["schemas"]["User"];
      requested: string;
      requestedUser: components["schemas"]["User"];
      /** Format: date-time */
      requestedAt: string;
      ignored: boolean;
    };
    AddFriendRequestErrorResponse: {
      /** @enum {string} */
      message: "same user" | "invalid user" | "already friends" | "already sent";
    };
    DeleteFriendRequestErrorResponse: {
      /** @enum {string} */
      message: "request does not exist";
    };
    IgnoreFriendRequestErrorResponse: {
      /** @enum {string} */
      message: "request not exist";
    };
    SignInDto: {
      usernameEmail: string;
      password: string;
    };
    LoginResponse: {
      access_token: string;
    };
    CardRatiosDto: {
      lCards: number;
      streightCards: number;
      tCards: number;
    };
    TreasureCardChancesDto: {
      lCardTreasureChance: number;
      streightCardTreasureChance: number;
      tCardTreasureChance: number;
      fixCardTreasureChance: number;
    };
    GameSetupDto: {
      seed: string;
      boardWidth: number;
      boardHeight: number;
      cardsRatio: components["schemas"]["CardRatiosDto"];
      treasureCardChances: components["schemas"]["TreasureCardChancesDto"];
    };
    CreateGameDto: {
      /** @enum {string} */
      visibility: "public" | "friends" | "private";
      gameSetup: components["schemas"]["GameSetupDto"];
    };
    CreateGameResponse: {
      gameID: string;
    };
    CreateGameErrorResponse: {
      /** @enum {string} */
      message: "invalid setup";
    };
    Game: {
      id: string;
      /** @enum {string} */
      visibility: "public" | "friends" | "private";
      /** Format: date-time */
      startTime: string;
      gameState: string;
      gameSetup: string;
      ownerUserID: string;
      ownerUser: components["schemas"]["User"];
      finished: boolean;
      started: boolean;
    };
    GetErrorResponse: Record<string, never>;
    UpdateGameDto: {
      /** @enum {string} */
      visibility: "public" | "friends" | "private";
      gameSetup: components["schemas"]["GameSetupDto"];
      id: string;
      ownerID?: string;
    };
    UpdateGameErrorResponse: {
      /** @enum {string} */
      message: "game does not exist" | "invalid setup" | "no permission" | "game has already started";
    };
    ShiftPositionDto: {
      /** @enum {number} */
      heading: 0 | 1 | 2 | 3;
      index: number;
    };
    BoardPositionDto: {
      x: number;
      y: number;
    };
    MoveDto: {
      playerIndex: number;
      rotateBeforeShift: number;
      fromShiftPosition: components["schemas"]["ShiftPositionDto"];
      toShiftPosition: components["schemas"]["ShiftPositionDto"];
      from: components["schemas"]["BoardPositionDto"];
      to: components["schemas"]["BoardPositionDto"];
      collectedTreasure: number | null;
    };
    MoveErrorResponse: {
      /** @enum {string} */
      message: "game does not exist" | "invalid move" | "the game did not start yet";
    };
    PlayerPlaysGame: {
      id: string;
      /** @enum {string|null} */
      botType: "weak_bot" | "medium_bot" | "strong_bot" | null;
      gameID: string;
      userID: string | null;
      user: components["schemas"]["User"] | null;
      playerIndex: number;
      ready: boolean;
      isWinner: boolean;
      gameFinished: boolean;
    };
    JoinErrorResponse: {
      /** @enum {string} */
      message: "game does not exist" | "already playing" | "user does not exist" | "game has already started" | "game full";
    };
    AddBotErrorResponse: {
      /** @enum {string} */
      message: "game does not exist" | "no permission" | "game has already started" | "game full";
    };
    RemoveGamePlayerErrorResponse: {
      /** @enum {string} */
      message: "game does not exist" | "no permission" | "game has already started";
    };
    MakeAdminErrorResponse: {
      /** @enum {string} */
      message: "game does not exist" | "no permission";
    };
  };
  responses: never;
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
}

export type $defs = Record<string, never>;

export type external = Record<string, never>;

export interface operations {

  AppController_getHello: {
    responses: {
      200: {
        content: {
          "application/json": string;
        };
      };
    };
  };
  UsersController_register: {
    requestBody: {
      content: {
        "application/json": components["schemas"]["RegisterDto"];
      };
    };
    responses: {
      /** @description The registration was successful */
      201: {
        content: never;
      };
      400: {
        content: {
          "application/json": components["schemas"]["RegisterErrorResponse"];
        };
      };
    };
  };
  FriendsController_getFriends: {
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["Friendship"][];
        };
      };
    };
  };
  FriendsController_deleteFriend: {
    parameters: {
      query: {
        friendshipID: string;
      };
    };
    responses: {
      200: {
        content: never;
      };
      400: {
        content: {
          "application/json": components["schemas"]["DeleteFriendErrorResponse"];
        };
      };
    };
  };
  FriendsController_getSendFriendRequests: {
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["FriendRequest"][];
        };
      };
    };
  };
  FriendsController_getFriendRequests: {
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["FriendRequest"][];
        };
      };
    };
  };
  FriendsController_addFriendRequest: {
    parameters: {
      query: {
        username: string;
      };
    };
    responses: {
      /** @description Request was send successfully */
      201: {
        content: never;
      };
      400: {
        content: {
          "application/json": components["schemas"]["AddFriendRequestErrorResponse"];
        };
      };
    };
  };
  FriendsController_deleteFriendRequest: {
    parameters: {
      query: {
        requestID: string;
      };
    };
    responses: {
      /** @description request was deleted */
      200: {
        content: never;
      };
      400: {
        content: {
          "application/json": components["schemas"]["DeleteFriendRequestErrorResponse"];
        };
      };
    };
  };
  FriendsController_ignoreFriendRequest: {
    parameters: {
      query: {
        requestID: string;
      };
    };
    responses: {
      /** @description request was ignored */
      200: {
        content: never;
      };
      400: {
        content: {
          "application/json": components["schemas"]["IgnoreFriendRequestErrorResponse"];
        };
      };
    };
  };
  AuthController_login: {
    requestBody: {
      content: {
        "application/json": components["schemas"]["SignInDto"];
      };
    };
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["LoginResponse"];
        };
      };
      /** @description incorrect username or password */
      401: {
        content: never;
      };
    };
  };
  AuthController_getProfile: {
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["User"];
        };
      };
    };
  };
  GameController_findOne: {
    parameters: {
      query: {
        gameID: string;
      };
    };
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["Game"];
        };
      };
      400: {
        content: {
          "application/json": components["schemas"]["GetErrorResponse"];
        };
      };
    };
  };
  GameController_update: {
    requestBody: {
      content: {
        "application/json": components["schemas"]["UpdateGameDto"];
      };
    };
    responses: {
      200: {
        content: never;
      };
      400: {
        content: {
          "application/json": components["schemas"]["UpdateGameErrorResponse"];
        };
      };
    };
  };
  GameController_create: {
    requestBody: {
      content: {
        "application/json": components["schemas"]["CreateGameDto"];
      };
    };
    responses: {
      201: {
        content: {
          "application/json": components["schemas"]["CreateGameResponse"];
        };
      };
      400: {
        content: {
          "application/json": components["schemas"]["CreateGameErrorResponse"];
        };
      };
    };
  };
  GameController_move: {
    parameters: {
      query: {
        game: string;
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["MoveDto"];
      };
    };
    responses: {
      201: {
        content: never;
      };
      400: {
        content: {
          "application/json": components["schemas"]["MoveErrorResponse"];
        };
      };
    };
  };
  GameController_findAvailableToJoin: {
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["Game"][];
        };
      };
    };
  };
  GameController_findPlayers: {
    parameters: {
      query: {
        gameID: string;
      };
    };
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["PlayerPlaysGame"][];
        };
      };
    };
  };
  GameController_findOwnGames: {
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["Game"][];
        };
      };
    };
  };
  GameController_join: {
    parameters: {
      query: {
        gameID: string;
      };
    };
    responses: {
      200: {
        content: never;
      };
      400: {
        content: {
          "application/json": components["schemas"]["JoinErrorResponse"];
        };
      };
    };
  };
  GameController_addBot: {
    parameters: {
      query: {
        gameID: string;
        botType: "weak_bot" | "medium_bot" | "strong_bot";
      };
    };
    responses: {
      201: {
        content: never;
      };
      400: {
        content: {
          "application/json": components["schemas"]["AddBotErrorResponse"];
        };
      };
    };
  };
  GameController_setReady: {
    parameters: {
      query: {
        game: string;
        ready: boolean;
      };
    };
    responses: {
      200: {
        content: never;
      };
    };
  };
  GameController_leaveGame: {
    parameters: {
      query: {
        gameID: string;
        userIndex: number;
      };
    };
    responses: {
      200: {
        content: never;
      };
      400: {
        content: {
          "application/json": components["schemas"]["RemoveGamePlayerErrorResponse"];
        };
      };
    };
  };
  GameController_makeAdmin: {
    parameters: {
      query: {
        gameID: string;
        userID: string;
      };
    };
    responses: {
      200: {
        content: never;
      };
      400: {
        content: {
          "application/json": components["schemas"]["MakeAdminErrorResponse"];
        };
      };
    };
  };
}
