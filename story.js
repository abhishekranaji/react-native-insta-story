import React from 'react';
import {FlatList, 
    View, 
    SafeAreaView,
    Text, 
    Image, 
    Dimensions, 
    LayoutAnimation,}
     from 'react-native';
import * as Progress from 'react-native-progress';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Ionicons from 'react-native-ionicons';

let CurrentSlide = 0;
let StoryHold = false;
const imagesData = [
    {
      image:
        'https://images.unsplash.com/photo-1567226475328-9d6baaf565cf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
      desc: 'Silent Waters in the mountains in midst of Himilayas',
    },
    {
      image:
        'https://images.unsplash.com/photo-1455620611406-966ca6889d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1130&q=80',
      desc:
        'Red fort in India New Delhi is a magnificient masterpeiece of humans',
    },
    {
      image:
        'https://images.unsplash.com/photo-1477587458883-47145ed94245?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80',
      desc:
        'Sample Description below the image for representation purpose only',
    },
    {
      image:
        'https://images.unsplash.com/photo-1568700942090-19dc36fab0c4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80',
      desc:
        'Sample Description below the image for representation purpose only',
    },
    {
      image:
        'https://images.unsplash.com/photo-1584271854089-9bb3e5168e32?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1051&q=80',
      desc:
        'Sample Description below the image for representation purpose only',
    },
  ]


class Story extends React.Component {

    slider = React.createRef()

    constructor(props) {
        super(props)
        this.state ={
            index : 0,
            data : imagesData,
            destCord : {},
            curCord : {},
            time : 0,
            holdTime : 0,
            autoPlayTime : 6000
        }
    }

    componentDidMount = () => {
        this.stopAutoPlay()
        this.mounted = true;
        this.startAutoPlay();
    }

    componentWillUnmount = () => {
        this.mounted = false
        this.stopAutoPlay();
    }

    startAutoPlay = () => {
        if (this.state.holdTime > 0) {
            this.sliderTimer = setInterval(() => { 
            this.changeSliderListIndex(true)},
            6000-this.state.holdTime,
        )}else {
            this.sliderTimer = setInterval(() =>
                {this.changeSliderListIndex(true)},
                6000
            )}
        this.dummyTimer = setInterval(() => {this.setState({time : this.state.time+1})}, 100)
    };

    stopAutoPlay = () => {
        if (this.sliderTimer) {
            clearInterval(this.sliderTimer);
            this.sliderTimer = null;
        }
        if (this.dummyTimer) {
            clearInterval(this.dummyTimer);
            this.dummyTimer = null;
        }
    };

    handleLeftClick = () => {
        if (CurrentSlide !==0) {
            this.stopAutoPlay()
            this.setState({time : 0})
            this.slider.current.scrollToIndex({
                index: --CurrentSlide,
                animated: true,
                })
            this.startAutoPlay()
        }  
    }

    handleRightClick = () => {
        this.stopAutoPlay()
        this.setState({time:0})
        if (CurrentSlide < this.state.data.length-1) {
            this.slider.current.scrollToIndex({
                index: ++CurrentSlide,
                animated: true,
                }
            )
            this.startAutoPlay()
        }
    }

    handleHoldClick = () => {
        StoryHold = true
        this.setState({holdTime : this.state.time*100})
        this.setState({autoPlayTime : this.state.autoPlayTime - this.state.time*100})
        this.stopAutoPlay()
    }

    handleHoldRelease = () => {
        if (StoryHold) {
            this.startAutoPlay();
            StoryHold = false;
        }
    }

    changeSliderListIndex = (next) => {
        if (this.state.holdTime > 0) {
            this.stopAutoPlay()
        }
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeIn);
        if (CurrentSlide >= this.state.data.length - 1) {
            CurrentSlide = 0
            this.stopAutoPlay()
            this.props.navigation.pop()
        }else {
            if (next) {
                CurrentSlide = ++CurrentSlide
            }
            this.slider.current.scrollToIndex({
                index: CurrentSlide,
                animated: true,
            });
            this.setState({time : 0})
            if (this.state.holdTime > 0) {
                this.setState({holdTime:0});
                this.startAutoPlay()
            }
        }
    };
    
    handleClose = () => {
        CurrentSlide=0
        this.props.navigation.goBack()
    }

    render() {
        const screenWidth = Math.round(Dimensions.get('window').width);
        return(
            <SafeAreaView style={{flex:1}}>
                {/* Stories Slider */}
                <FlatList
                    ref={this.slider}
                    horizontal
                    style={{flex:1}}
                    pagingEnabled={false}
                    showsHorizontalScrollIndicator={false}
                    data={this.state.data}
                    snapToInterval={screenWidth}
                    decelerationRate="fast"
                    bounces={false}
                    renderItem={({item : rowData}) => {
                        return(
                            <View style={{flex:1}}>
                                <Image style={{width:screenWidth, height:"100%"}} resizeMode='cover' source={{uri : rowData.image}} />
                            </View>
                        )
                    }}
                    scrollEnabled={false}
                    keyExtractor={(item, index) => index.toString()}
                    getItemLayout={(data, index) => ({
                        length: screenWidth,
                        offset: screenWidth * index,
                        index,
                    })}
                >
                </FlatList>

                {/* Overlays that handle Left, Right and hold actions */}
                <View style={{position:'absolute', top:0, bottom:0, left:0, right:0,}}>
                    <View style={{flex : 1, flexDirection:'row', justifyContent:'space-between'}} >
                        <TouchableOpacity 
                            style={{flex:1, width:screenWidth/2}} 
                            onLongPress={this.handleHoldClick}
                            onPressOut = {this.handleHoldRelease}
                            onPress={this.handleLeftClick}
                        />
                        <TouchableOpacity 
                            style={{width:screenWidth/2, flex:1}} 
                            onLongPress={this.handleHoldClick}
                            onPressOut = {this.handleHoldRelease}
                            onPress={this.handleRightClick}
                        /> 
                    </View>
                </View>
                
                {/* ----------------------------------- */}

                {/* Indicators */}
                <View style={{position:'absolute', flexDirection:'row', padding:5, marginTop:30, marginRight:70, marginLeft:10}}>   
                    {this.state.data.map((data, index) => {
                        if (CurrentSlide === index) {
                            return (
                                <Progress.Bar 
                                width={null} 
                                color={'rgba(255,185,0,1)'}
                                unfilledColor={'rgba(255,255,255,.7)'} 
                                borderWidth={0}
                                height={2}
                                style={{flex:1, height:2,marginRight:3}} 
                                key={index} 
                                progress={
                                        (parseFloat(parseFloat(this.state.time/60).toFixed(1)))
                                    }
                                animationType={'timing'}
                                />
                            )
                        } else if(index < CurrentSlide) {
                            return (
                                <Progress.Bar 
                                width={null} 
                                color={'rgba(255,185,0,1)'} 
                                unfilledColor={'rgba(255,255,255,.7)'} 
                                borderWidth={0} 
                                height={2}
                                style={{flex:1, height:2, marginRight:3}} 
                                key={index} 
                                progress={1}
                                />
                            )
                        }
                        else {
                            return(
                                <Progress.Bar 
                                    width={null} 
                                    color={'rgba(255,185,0,1)'} 
                                    unfilledColor={'rgba(255,255,255,.7)'} 
                                    borderWidth={0} 
                                    height={2}
                                    style={{flex:1, height:2, marginRight:3}} 
                                    key={index} 
                                    progress={0}
                                    />
                            )
                        }
                    }
                    )}
                </View>

                {/* ------------------------------- */}

                {/* Close Button */}
                <View style={{position:'absolute', right:10, top:10}}>
                    <TouchableOpacity 
                    style={{backgroundColor:'white', width:50, height:50, alignItems:'center', justifyContent:'center', borderRadius:10, elevation:3, opacity:.7}}
                    onPress={this.handleClose}
                    >
                        <Ionicons name='close' />
                    </TouchableOpacity>
                </View>
                {/* -------------------------------- */}

                {/* If you want add any new Component You can add as follows */}
                <View style={{position:'absolute', bottom:50, alignSelf:'center'}}>
                    <TouchableOpacity
                    style={{backgroundColor:'#ffb900', width:200, height:40, alignItems:'center', justifyContent:'center', elevation:3, borderRadius:10}}
                    >
                        <Text style={{color:'white', textDecorationStyle:'double', fontWeight:'bold'}}>GET DIRECTION</Text>
                    </TouchableOpacity>
                </View>
                {/* ---------------------------------- */}
            </SafeAreaView>
        )
    }
}

export default Story