
/**
 * The GameEngine contains the game logic.  Extend this type
 * to implement game mechanics.  The GameEngine derived
 * instance runs once on the server, where the final decisions
 * are always taken, and one instance will run on each client as well,
 * where the client emulates what it expects to be happening
 * on the server.
 *
 * The game engine's logic must listen to user inputs and
 * act on these inputs to change the game state.  For example,
 * the game engine listens to controller/keyboard inputs to infer
 * movement for the player/ship/first-person.  The game engine listens
 * to clicks, button-presses to infer firing, etc..
 *
 * Note that the game engine runs on both the server and on the
 * clients - but the server decisions always have the final say,
 * and therefore clients must resolve server updates which conflict
 * with client-side predictions.
 */
export type GameEngine  = {
    /**
     *
     * @param options options object
     * @param options.traceLevel the trace level from 0 to 5.  Lower value traces more.
     * @param options.delayInputCount client side only.  Introduce an artificial delay on the client to better match the time it will occur on the server.  This value sets the number of steps the client will wait before applying the input locally
     */
    constructor(options: any);

    /**
     * client's player ID, as a string. If running on the client, this is set at runtime by the clientEngine
     */
    playerId: String;

    /**
     * Register a handler for an event
     * @param eventName name of the event
     * @param eventHandler handler function
     */
    on(eventName: String, eventHandler: () => void): void;

    /**
     * Register a handler for an event, called just once (if at all)
     * @param eventName name of the event
     * @param eventHandler handler function
     */
    once(eventName: String, eventHandler: () => void): void;

    /**
     * Remove a handler
     * @param eventName name of the event
     * @param eventHandler handler function
     */
    removeListener(eventName: String, eventHandler: () => void): void;

    /**
     * Start the game. This method runs on both server
     * and client. Extending the start method is useful
     * for setting up the game's worldSettings attribute,
     * and registering methods on the event handler.
     */
    start(): void;

    /**
     * Single game step.
     * @param isReenact is this step a re-enactment of the past.
     * @param t the current time (optional)
     * @param dt elapsed time since last step was called.  (optional)
     * @param physicsOnly do a physics step only, no game logic
     */
    step(isReenact: Boolean, t: Number, dt: Number, physicsOnly: Boolean): void;

    /**
     * Add object to the game world.
     * On the client side, the object may not be created, if the server copy
     * of this object is already in the game world.  This could happen when the client
     * is using delayed-input, and the RTT is very low.
     * @param object the object.
     */
    addObjectToWorld(object: Object): Object;

    /**
     * Override this function to implement input handling.
     * This method will be called on the specific client where the
     * input was received, and will also be called on the server
     * when the input reaches the server.  The client does not call this
     * method directly, rather the client calls {@link ClientEngine#sendInput}
     * so that the input is sent to both server and client, and so that
     * the input is delayed artificially if so configured.
     *
     * The input is described by a short string, and is given an index.
     * The index is used internally to keep track of inputs which have already been applied
     * on the client during synchronization.  The input is also associated with
     * the ID of a player.
     * @param inputMsg input descriptor object
     * @param inputMsg.input describe the input (e.g. "up", "down", "fire")
     * @param inputMsg.messageIndex input identifier
     * @param playerId the player ID
     * @param isServer indicate if this function is being called on the server side
     */
    processInput(inputMsg: Object, playerId: Number, isServer: Boolean): void;

    /**
     * Remove an object from the game world.
     * @param objectId the object or object ID
     */
    removeObjectFromWorld(objectId: Object | String): void;

    /**
     * Check if a given object is owned by the player on this client
     * @param object the game object to check
     */
    isOwnedByPlayer(object: Object): Boolean;

    /**
     * Register Game Object Classes
     * @param serializer the serializer
     */
    registerClasses(serializer: any): void;

}