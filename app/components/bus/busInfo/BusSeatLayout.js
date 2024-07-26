import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { responsiveHeight } from '../../../utils/responsiveScale';
import MyContext from '../../../context/Context';
import { busSeating, selectedSeat, sitterSelected, sleeperBedSelected, sleeperBedSelected1, sleeperbed, sleeperbed1, sleeperselected } from "./assets";
import { colors } from '../../../config/theme';
const BusSeatLayout = ({ seatData }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const { actions, NoofBusPassengers } = useContext(MyContext);

  useEffect(() => {
    actions.setBusBookDetails(selectedSeats, "seat");
  }, [selectedSeats]);

  const toggleSeatSelection = (seat) => {
    console.log(seat)
    const isSelected = selectedSeats.some(
      (s) =>
        s.RowNo === seat.RowNo &&
        s.ColumnNo === seat.ColumnNo &&
        s.IsUpper === seat.IsUpper
    );

    if (seat.SeatStatus) {
      if (isSelected) {
        // Remove seat from selected seats
        setSelectedSeats((prevSelectedSeats) =>
          prevSelectedSeats.filter(
            (s) =>
              !(
                s.RowNo === seat.RowNo &&
                s.ColumnNo === seat.ColumnNo &&
                s.IsUpper === seat.IsUpper
              )
          )
        );
      } else {
        // Add seat to selected seats
        setSelectedSeats((prevSelectedSeats) => {
          const updatedSeats = [...prevSelectedSeats, seat];
          if (updatedSeats.length > NoofBusPassengers) {
            // Remove the oldest seat if limit is exceeded
            updatedSeats.shift();
          }
          return updatedSeats;
        });
      }
    }
  };
  const getIconDetails = (seat, isSelected) => {
    if (!seat.SeatStatus) {
      return (
          seat.SeatType === 1? <Image
          source={sitterSelected}
          style={{  width: 35 * seat.Width,
            height: 35 * seat.Height,}}
        />:
        <Image
          source={sleeperselected}
          style={{  width: 35 * seat.Width,
            height: 35 * seat.Height,}}
          resizeMode="contain"
        />
      );
    } 
  //   else if (seat.IsLadiesSeat && seat.SeatType === 2) {
  //     return { iconName: "female", componentName: "FontAwesome", color: "purple" };
  //   }
  //    else if (seat.IsLadiesSeat) {
  //     return { iconName: "female", componentName: "FontAwesome", color: "pink" };
  //   } 
  //   else if (seat.IsMalesSeat) {
  //     return { iconName: "male", componentName: "FontAwesome", color: "blue" };
  //   } 
    else if (seat.SeatType === 2) {
      return (
        <Image
          source={isSelected ? sleeperBedSelected : sleeperbed}
          style={{  width: 35 * seat.Width,
            height: 35 * seat.Height,}}
          resizeMode="contain"
        />
      );
    }
    else if (seat.Width === 2) {
      return (
        <Image
          source={isSelected ? sleeperBedSelected1 : sleeperbed1}
          style={{  width: 35 * seat.Width,
            height: 35 * seat.Height,}}
          resizeMode="contain"
        />
      );
    }
    
    else {
      return (
        <Image
          source={isSelected ? selectedSeat : busSeating}
          style={{ height: responsiveHeight(3.5), width: responsiveHeight(3.5) }}
        />
      );
    }
  };
  // Filter and flatten seat data
  const lowerDeckData = seatData?.filter(
    (row) => !row.some((seat) => seat.IsUpper)
  );
  const upperDeckData = seatData?.filter((row) =>
    row.some((seat) => seat.IsUpper)
  );
  const lowerDeck = lowerDeckData.flat(lowerDeckData.length);
  const upperDeck = upperDeckData.flat(upperDeckData.length);

  // Calculate dimensions
  const columnCount = Math.max(...lowerDeck.map(o => parseInt(o.RowNo, 10)));
  const columnCount1 = Math.max(...upperDeck.map(o => parseInt(o.RowNo, 10)));
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: responsiveHeight(2), flex: 1 }}>
      {/* lowerDeck */}
      <View style={[styles.container, { height: responsiveHeight(65) }]}>
        {lowerDeck.map((item) =>{ 
           const isSelected=selectedSeats.some(
            (s) =>
              s.RowNo === item.RowNo &&
              s.ColumnNo === item.ColumnNo &&
              s.IsUpper === item.IsUpper)
          return(
          <TouchableOpacity
            style={{
              width: 35 * item.Width,
              height: 35 * item.Height,
              margin: 13,
              position: 'absolute',
              left: (columnCount - parseInt(item.RowNo, 10)) * 40,
              top: parseInt(item.ColumnNo, 10) * 40,
            }}
            key={item.SeatName}
            onPress={() => toggleSeatSelection(item)}
            disabled={!item.SeatStatus}
          >
             {getIconDetails(item, isSelected)}
          </TouchableOpacity>
        )})}
      </View>
      {/* upperDeck */}
      <View style={[styles.container, { height: responsiveHeight(65) }]}>
        {upperDeck.map((item) =>{
          const isSelected=selectedSeats.some(
            (s) =>
              s.RowNo === item.RowNo &&
              s.ColumnNo === item.ColumnNo &&
              s.IsUpper === item.IsUpper)
          return (
          <TouchableOpacity
            style={{
              width: 35 * item.Width,
              height: 35 * item.Height,
              margin: 13,
              position: 'absolute',
              left: (columnCount1 - parseInt(item.RowNo, 10)) * 40,
              top: parseInt(item.ColumnNo, 10) * 40,
            }}
            key={item.SeatName}
            onPress={() => toggleSeatSelection(item)}
          >
            {getIconDetails(item, isSelected)}
          </TouchableOpacity>
        )})}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 10,
    backgroundColor: colors.whiteSmoke,
    padding: 8,
    borderWidth: 1,
    borderRadius: 10,
  },
});

export default BusSeatLayout;
