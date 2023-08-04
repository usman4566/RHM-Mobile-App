import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import tw from "tailwind-react-native-classnames";
import { useSelector, useDispatch } from "react-redux";
import {
  selectDestination,
  selectOrigin,
  resetOrigin,
  resetDestination,
} from "../slices/navSlice";
import MapViewDirections from "react-native-maps-directions";
import { GOOGLE_MAPS_APIKEY } from "@env";
import axios from "axios";
import polyline from "@mapbox/polyline";
import * as Location from "expo-location";

const Map = () => {
  const dispatch = useDispatch();
  const origin = useSelector(selectOrigin);
  const destination = useSelector(selectDestination);
  const mapRef = useRef(null);
  const [region, setRegion] = useState(null);
  const [showDirections, setShowDirections] = useState(false);
  const [mapType, setMapType] = useState("mutedStandard");
  const [routes, setRoutes] = useState([]);
  const [classifiedData, setClassifiedData] = useState([]);
  const [showRoadConditions, setShowRoadConditions] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    if (!origin || !destination) return;

    const bounds = [
      {
        latitude: origin.location.lat,
        longitude: origin.location.lng,
        description: origin.description,
      },
      {
        latitude: destination.location.lat,
        longitude: destination.location.lng,
        description: destination.description,
      },
    ];

    mapRef.current.fitToCoordinates(bounds, {
      edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
    });

    setRegion({
      latitude: (bounds[0].latitude + bounds[1].latitude) / 2,
      longitude: (bounds[0].longitude + bounds[1].longitude) / 2,
      latitudeDelta: Math.abs(bounds[0].latitude - bounds[1].latitude) + 0.005,
      longitudeDelta:
        Math.abs(bounds[0].longitude - bounds[1].longitude) + 0.005,
    });

    setShowDirections(false);
    setRoutes([]);
  }, [origin, destination]);

  useEffect(() => {
    return () => {
      dispatch(resetOrigin());
      dispatch(resetDestination());
    };
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Location Permission",
          "Please grant location permission to use this feature."
        );
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });

      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  const fetchRoutes = async () => {
    try {
      const apiKey = GOOGLE_MAPS_APIKEY;
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.location.lat},${origin.location.lng}&destination=${destination.location.lat},${destination.location.lng}&key=${apiKey}&alternatives=true`
      );

      const routes = response.data.routes.map((route) => ({
        coordinates: polyline
          .decode(route.overview_polyline.points)
          .map(([latitude, longitude]) => ({ latitude, longitude })),
        distance: route.legs[0].distance.text,
        duration: route.legs[0].duration.text,
      }));

      setRoutes(routes);
    } catch (error) {
      console.error("Error fetching routes:", error);
    }
  };

  const fetchClassifiedData = async () => {
    try {
      const response = await axios.get("http://192.168.43.146:3000/classified");
      const newData = response.data;
      setClassifiedData(newData);

      mapRef.current?.fitToCoordinates(newData, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
      });
    } catch (error) {
      console.error("Error fetching classified data:", error);
    }
  };

  const renderMarkers = () => {
    const markers = classifiedData.map((data) => (
      <Marker
        key={data._id}
        coordinate={{
          latitude: Number(data.Latitude) || 0,
          longitude: Number(data.Longitude) || 0,
        }}
        title={data.Class.toString()}
        pinColor={getMarkerColor(data.Class)}
      />
    ));
    return <>{markers}</>;
  };

  const getMarkerColor = (classValue) => {
    let markerColor;
    switch (classValue) {
      case 0:
        markerColor = "green";
        break;
      case 1:
        markerColor = "red";
        break;
      case 2:
        markerColor = "orange";
        break;
      default:
        markerColor = "blue";
    }
    return markerColor;
  };

  const handleGetDirections = () => {
    if (!origin || !destination) {
      Alert.alert("Error", "Please enter origin and destination");
      return;
    }

    setShowDirections(!showDirections);
    if (showDirections) {
      setRoutes([]);
    } else {
      fetchRoutes();
    }
  };

  const handleShowRoadConditions = () => {
    setShowRoadConditions(!showRoadConditions);

    if (showRoadConditions) {
      setClassifiedData([]);
    } else {
      fetchClassifiedData();
    }
  };

  return (
    <View style={tw`flex-1`}>
      <MapView
        ref={mapRef}
        style={tw`flex-1`}
        initialRegion={region}
        mapType={mapType}
        showsTraffic={true}
      >
        {showDirections && origin && destination && (
          <MapViewDirections
            origin={origin.description}
            destination={destination.description}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={5}
            strokeColor="blue"
            optimizeWaypoints={true}
            onStart={() => setShowDirections(true)}
            onReady={(result) => {
              mapRef.current.fitToCoordinates(result.coordinates, {
                edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
              });
            }}
          />
        )}
        {origin && (
          <Marker
            coordinate={{
              latitude: origin.location.lat,
              longitude: origin.location.lng,
            }}
            title="Origin"
            description={origin.description}
            identifier="origin"
          />
        )}
        {destination && (
          <Marker
            coordinate={{
              latitude: destination.location.lat,
              longitude: destination.location.lng,
            }}
            title="Destination"
            description={destination.description}
            identifier="destination"
          />
        )}
        {currentLocation && (
          <Marker
            coordinate={currentLocation}
            title="Current Location"
            pinColor="blue"
          />
        )}
        {renderMarkers()}
      </MapView>

      <View style={tw`absolute top-2 right-1 z-50`}>
        <TouchableOpacity
          style={tw`bg-gray-100 p-2 rounded-full shadow-lg`}
          onPress={handleGetDirections}
        >
          <Text style={tw`text-gray-600 text-sm font-bold`}>
            {showDirections ? "Hide" : "Get Directions"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={tw`absolute top-2 left-1 z-50 flex flex-row`}>
        <View style={tw`mr-2`}>
          <TouchableOpacity
            style={tw`bg-gray-100 p-3 rounded-full shadow-lg`}
            onPress={handleShowRoadConditions}
          >
            <Text style={tw`text-gray-600 text-sm font-bold`}>
              {showRoadConditions
                ? "Hide Road Conditions"
                : "Show Road Conditions"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Map;
