port module Snake exposing (..)

import Html exposing (..)
import Html.Attributes exposing (style)
import Time exposing (Time, millisecond)
import Random exposing (generate, int)


type alias Coords =
    ( Int, Int )


type alias Speed =
    Coords


type alias Food =
    Coords


type alias Level =
    List Coords


type alias Snake =
    List Coords


type Cell
    = Empty
    | Food
    | Segment


type Msg
    = Tick Time
    | Turn String
    | Feed Int
    | Command String


type alias Model =
    { playing : Bool
    , snake : Snake
    , speed : Speed
    , nextSpeed : Maybe Speed
    , food : Maybe Food
    , foodTicks : Int
    }


main : Program Never Model Msg
main =
    Html.program
        { init = init False
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


levelSize : Int
levelSize =
    10


cellSize : Int
cellSize =
    30


snakeLength : Int
snakeLength =
    3


tickInterval : Time
tickInterval =
    200 * millisecond


foodLifetime : Int
foodLifetime =
    25


newSnake : Snake
newSnake =
    let
        center : Int
        center =
            levelSize // 2
    in
        List.range center (center + snakeLength - 1)
            |> List.map (\x -> ( x, center ))


initialSpeed : Speed
initialSpeed =
    ( -1, 0 )


level : Level
level =
    let
        indexes : List Int
        indexes =
            List.range 0 (levelSize ^ 2 - 1)
    in
        List.map (\i -> ( i % levelSize, i // levelSize )) indexes


init : Bool -> ( Model, Cmd Msg )
init playing =
    Model playing newSnake initialSpeed Nothing Nothing 0 ! []


move : Snake -> Speed -> Maybe Food -> ( Snake, Bool )
move snake ( sX, sY ) food =
    let
        snakeHead : Coords
        snakeHead =
            case List.head snake of
                Just ( hX, hY ) ->
                    ( hX + sX, hY + sY )

                Nothing ->
                    ( 0, 0 )

        dropSegments : Int
        dropSegments =
            case food of
                Just val ->
                    if (snakeHead == val) then
                        0
                    else
                        1

                Nothing ->
                    1
    in
        ( snake
            |> List.take (List.length snake - dropSegments)
            |> (::) snakeHead
        , dropSegments == 0
        )


collides : Snake -> Bool
collides snake =
    let
        snakeHead : Maybe Coords
        snakeHead =
            List.head snake

        snakeTail : Maybe (List Coords)
        snakeTail =
            List.tail snake
    in
        case ( snakeHead, snakeTail ) of
            ( Just sHead, Just sTail ) ->
                let
                    ( x, y ) =
                        sHead
                in
                    List.member sHead sTail
                    || x < 0
                    || x >= levelSize
                    || y < 0
                    || y >= levelSize

            _ ->
                False


feedCmd : Snake -> Cmd Msg
feedCmd snake =
    let
        snakeSize : Int
        snakeSize =
            List.length snake
    in
        generate Feed <| int 0 <| levelSize ^ 2 - snakeSize


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Tick _ ->
            let
                hit : Bool
                hit =
                    collides snake

                playing : Bool
                playing =
                    model.playing && not hit

                speed : Speed
                speed =
                    case model.nextSpeed of
                        Just val ->
                            val

                        Nothing ->
                            model.speed

                ( snake, hasEaten ) =
                    move model.snake speed model.food

                nextSpeed : Maybe Speed
                nextSpeed =
                    Nothing

                food : Maybe Food
                food =
                    case hasEaten of
                        True ->
                            Nothing

                        False ->
                            model.food

                rottenFood : Bool
                rottenFood =
                    model.foodTicks == foodLifetime

                foodTicks : Int
                foodTicks =
                    if hasEaten || rottenFood then
                        0
                    else
                        model.foodTicks + 1

                foodCmds : List (Cmd Msg)
                foodCmds =
                    case food of
                        Nothing ->
                            [ feedCmd snake
                            ]

                        _ ->
                            if rottenFood then
                                [ feedCmd snake
                                ]
                            else
                                []

                scoreCmds : List (Cmd Msg)
                scoreCmds =
                    case hasEaten of
                        True ->
                            [ gameplay "SCORE"
                            ]

                        False ->
                            []

                cmds : List (Cmd Msg)
                cmds =
                    case ( hit, playing ) of
                        ( True, False ) ->
                            [ gameplay "GAME_OVER"
                            ]

                        _ ->
                            []
                                |> List.append foodCmds
                                |> List.append scoreCmds
            in
                Model playing snake speed nextSpeed food foodTicks ! cmds

        Command cmd ->
            case cmd of
                "NEW_GAME" ->
                    init True

                _ ->
                    model ! []

        Turn direction ->
            let
                ( x, y ) =
                    model.speed

                ( newX, newY ) =
                    case direction of
                        "LEFT" ->
                            if x /= 1 then
                                ( -1, 0 )
                            else
                                ( x, y )

                        "RIGHT" ->
                            if x /= -1 then
                                ( 1, 0 )
                            else
                                ( x, y )

                        "UP" ->
                            if y /= 1 then
                                ( 0, -1 )
                            else
                                ( x, y )

                        "DOWN" ->
                            if y /= -1 then
                                ( 0, 1 )
                            else
                                ( x, y )

                        _ ->
                            ( x, y )
            in
                { model | nextSpeed = Just ( newX, newY ) } ! []

        Feed index ->
            let
                snake : Snake
                snake =
                    model.snake

                filterFn : Coords -> Bool
                filterFn c =
                    not (List.member c snake)

                emptyCells : List Coords
                emptyCells =
                    List.filter filterFn level

                foodCell : Maybe Coords
                foodCell =
                    emptyCells
                        |> List.drop (index - 1)
                        |> List.head
            in
                case foodCell of
                    Just val ->
                        { model | food = Just val } ! []

                    Nothing ->
                        model ! []


formatCell : Snake -> Maybe Food -> Coords -> Cell
formatCell snake food coords =
    let
        foodCell : Coords
        foodCell =
            case food of
                Just val ->
                    val

                Nothing ->
                    ( -1, -1 )
    in
        if (List.member coords snake) then
            Segment
        else if (coords == foodCell) then
            Food
        else
            Empty


renderCell : Cell -> Html msg
renderCell cell =
    let
        bg : String
        bg =
            case cell of
                Empty ->
                    "transparent"

                Segment ->
                    "darkgreen"

                Food ->
                    "orange"
    in
        div
            [ style
                [ ( "width", (toString cellSize) ++ "px" )
                , ( "height", (toString cellSize) ++ "px" )
                , ( "float", "left" )
                , ( "background", bg )
                ]
            ]
            []


renderLevel : Snake -> Maybe Food -> Html msg
renderLevel snake food =
    let
        mapFn : Coords -> Cell
        mapFn =
            formatCell snake food

        cells : List Cell
        cells =
            List.map mapFn level
    in
        div
            [ style
                [ ( "width", (toString <| levelSize * cellSize) ++ "px" )
                , ( "overflow", "hidden" )
                , ( "border", "1px solid black" )
                , ( "margin-bottom", "1em" )
                , ( "background", "cornsilk" )
                ]
            ]
            (List.map renderCell cells)


view : Model -> Html msg
view { snake, food, playing } =
    div []
        [ if playing then
            renderLevel snake food
          else
            h1 []
                [ text "Snake!"
                ]
        ]


port turns : (String -> msg) -> Sub msg


port control : (String -> msg) -> Sub msg


port gameplay : String -> Cmd msg


subscriptions : Model -> Sub Msg
subscriptions model =
    let
        { playing } =
            model

        defaultSubs : List (Sub Msg)
        defaultSubs =
            [ control Command
            ]

        playingSubs : List (Sub Msg)
        playingSubs =
            [ Time.every tickInterval Tick
            , turns Turn
            ]
    in
        case playing of
            True ->
                Sub.batch
                    ([]
                        |> List.append defaultSubs
                        |> List.append playingSubs
                    )

            False ->
                Sub.batch defaultSubs
