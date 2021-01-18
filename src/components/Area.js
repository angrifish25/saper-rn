import React, { Component } from 'react';

import { StyleSheet, 
    Text, 
    View, 
    TouchableOpacity, 
    Dimensions, 
    Modal 
} from 'react-native';
import checkBomb from '../helpers/checkBomb';
const {height, width} = Dimensions.get('window');

export default class Area extends Component {
    state = {
        bombs: 0,
        areaArray: [],
        finish: 0
    }
    complexity = {
        easy: {
            width: 10,
            height: 10,
            bomb: 20
        },
    }

    generateGame() {
        const complexity  = this.complexity[this.props.complexity],
        maxBombs = complexity.bomb;
        
        let areaArray = [],
        fileds = complexity.height*complexity.width;
        let bombs = 0
        
        for ( let i = 0; i < fileds; i++ ) {
            let isBomb = false,
            y = Math.floor(i/10),
            x = i%complexity.width;

            if(Math.random()*fileds<complexity.width && (maxBombs - bombs) > 0 ) {
                isBomb = true;
                bombs++;
            }

            areaArray[i] = {
                key: `${y}_${x}`,
                innerValue: null,
                isBomb,
                isOpen: false,
                isViseted: false,
                isFlag: false
            };
        }

        for ( let i = 0; i < fileds; i++ ) {
            const y = Math.floor(i/10),
            x = i%complexity.width;
            let num = 0;

            for(let k=0;k<9;k++) {
                num += checkBomb((y-(Math.floor(k/3)-1))+'_'+(x-(k%3-1)), areaArray);
            }

            areaArray[i].innerValue = num;
        }
        this.setState({
            bombs,
            areaArray
        })
    }
    componentDidMount () {
        this.generateGame();
    }
    
    onSetFlag(oItem) {
        if (!oItem.isOpen) {
            const { areaArray } = this.state;
            let index = null;
            areaArray.forEach((item, i) => {
                if (item.key == oItem.key) {
                    index = i;
                }
            });

            areaArray[index].isFlag = !areaArray[index].isFlag;

            this.setState({
                areaArray
            });
        }
    }
    onPressBlock(oItem, event) {
        if (!oItem.isOpen) {
            const { areaArray, bombs } = this.state;
            let { finish } = this.state;
            let index = null;
            areaArray.forEach((item, i) => {
                if (item.key == oItem.key) {
                    index = i;
                }
            });

            let yx = oItem.key.split('_');

            let y = yx[0],
            x = yx[1];
            areaArray[index].isFlag = false;
            if ( oItem.isBomb ) {
                for (let i=0; i < areaArray.length; i++) {
                    areaArray[i].isOpen = true;
                };
                finish = 2
            } else if (!oItem.isFlag) {
                areaArray[index].isOpen = true;
                let len=0;


                areaArray.forEach((item) => {
                    if (!item.isOpen) {
                        len++
                    }
                })
                
                if(len==bombs && finish == 0 ) {
                    finish = 1
                }
                
            }

            this.setState({
                finish,
                areaArray
            });

            if (!oItem.isBomb && oItem.innerValue == 0) {
                for (let k=0; k<9; k++) {
                    let key = `${y-((Math.floor(k/3)-1))}_${x-(((k%3)-1))}`;
                    let block = areaArray.filter((item) => item.key == key)[0];

                    if (block && !block.isFlag) {
                        this.onPressBlock.call(this, block);
                    }
                }
            }
        }
    }
    renderBlock(props) {
        
        const complexity  = this.complexity[this.props.complexity],
        { isBomb, innerValue, key, isOpen, isFlag } = props;

        let sValue = '',
        backgroundColor = '#D8D8D8';

        let widthB = ( width - 30 )/complexity.width,
        heightB = ( width - 30 )/complexity.width;

        if (isBomb) {
            sValue = '💣';
        } else if (innerValue) {
            sValue = innerValue;
        }

        if (isFlag) {
            backgroundColor = '#F4A460'
        } else if (isOpen) {
            backgroundColor = '#FAFAFA'
        }
        
        return (
            <TouchableOpacity key={key} style={ [styles.block, {backgroundColor, width: widthB, height: heightB}] } onLongPress={this.onSetFlag.bind(this, props)} onPress={this.onPressBlock.bind(this, props)}>
                <Text>{isOpen ? sValue : isFlag ? '🚩' : ''}</Text>
            </TouchableOpacity>);
    }

    render() {
        const { areaArray, bombs, finish } = this.state;
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={{ fontSize: 20}}>💣: {bombs}</Text>
                    <TouchableOpacity
                        style={{ marginTop: 0 }}
                        onPress={() => {
                            this.setState({
                                finish: 0,
                                bombs: 0,
                                areaArray: []
                            });
                            this.generateGame();
                        }}>
                        <Text style={styles.btnReload}>Перезагрузить</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.area}>
                    { areaArray.map(this.renderBlock, this) }
                </View>
                <View style={styles.footer}>
                </View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={finish == 0 ? false : true}
                    onRequestClose={() => {
                        this.setState({
                            bombs: 0,
                            areaArray: []
                        });
                        this.generateGame();
                    }}
                    onDismiss={() => {
                        this.setState({
                            bombs: 0,
                            areaArray: []
                        });
                        this.generateGame();
                    }}>
                        <View style={styles.modal}>
                        <Text style={styles.mainText}>{ finish == 1 ? 'Победа!' : finish == 2 ? 'Вы проиграли!' : null }</Text>

                        <TouchableOpacity
                            style={styles.buttonNewGame}
                            onPress={() => {
                            this.setState({
                                finish: 0
                            });
                            }}>
                            <Text style={styles.textButton}>Новая игра</Text>
                        </TouchableOpacity>
                        </View>
                </Modal>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        justifyContent: 'space-between'
    },
    footer: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        justifyContent: 'space-around'
    },
    mainText: {
        fontSize: 32
    },
    textButton: {
        color: '#F1F1F1',
        fontSize: 20
    },
    buttonNewGame: {
        marginTop: 30,
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: '#15A90A'
    },
    modal: {
        marginTop: (height/2)-100,
        flex: 1,
        backgroundColor: '#FAFAFA',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        paddingHorizontal: 50,
        paddingVertical: 50,
        borderWidth: 1,
        borderColor: '#979797',
        borderRadius: 8,
    },
    container: {

        marginTop: 60
    },
    btnReload: {
        fontSize: 28,
    },
    area: {
        paddingTop: 40,
        paddingHorizontal: 15,
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: '#fff',
    },
    block: {
        borderColor: '#979797',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
  }
})
