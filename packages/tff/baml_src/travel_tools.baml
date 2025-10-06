// Travel Agent Tools
class GetWeather {
  intent "get_weather"
  city string
}

class SearchFlights {
  intent "search_flights"
  from string
  to string
  date string
}

class SearchHotels {
  intent "search_hotels"
  city string
  checkIn string
  checkOut string
}

class BookTrip {
  intent "book_trip"
  destination string
  startDate string
  endDate string
}

class RespondToUser {
  intent "respond"
  message string
}

class Done {
  intent "done"
  message string @description("Summary of what was accomplished")
}

type TravelTools = GetWeather | SearchFlights | SearchHotels | BookTrip | RespondToUser | Done


