import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native';
import { ListItem } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage'

export default class App extends React.Component {

    constructor(props) {
      super(props)
      this.state = {
		  tasks: [],
		  inputTask: ''
	  }
	  this.addTask = this.addTask.bind(this)
	  this.markTask = this.markTask.bind(this)
	  this.deleteTask = this.deleteTask.bind(this)
	  this.getTasks = this.getTasks.bind(this)
	}

	componentDidMount(){
		this.getTasks()
	}

    render(){
		const tasks = this.state.tasks.map((task, index) => {
			return (
				<ListItem key={index} bottomDivider style={styles.list} onPress={() => this.markTask(index)}>
					<ListItem.Content style={styles.listContent}>
						<ListItem.Title style={task.done? {textDecorationLine: 'line-through'}:{}}>
							{task.name}
						</ListItem.Title>
						<Text style={styles.close} onPress={() => this.deleteTask(index)}>&#10006;</Text>
					</ListItem.Content>
				</ListItem>
			)
		})
		return (
			<View style={styles.container}>
				<StatusBar />
				<Text style={styles.title}>Your Tasks</Text>
				<ScrollView style={styles.innerView}>
					{ tasks }
				</ScrollView>
				<TextInput placeholder='Add Task...' value={this.state.inputTask} style={styles.newTask}
					onChangeText={text => this.setState({ inputTask: text })}
					onSubmitEditing={this.addTask}></TextInput>
			</View>
		)
	}
	
	addTask(){
		const tasks = this.state.tasks
		tasks.push({name: this.state.inputTask, done: false})
		this.setState({
			tasks: tasks,
			inputTask: ''
		})
		this.storeTasks(tasks)
	}

	markTask(index){
		const tasks = this.state.tasks
		tasks[index].done = !tasks[index].done
		this.setState({
			tasks: tasks
		})
		this.storeTasks(tasks)
	}

	deleteTask(index){
		const tasks = this.state.tasks.filter((task, ind) => ind !== index)
		this.setState({
			tasks: tasks
		})
		this.storeTasks(tasks)
	}

	async getTasks(){
		try {
			let tasks = await AsyncStorage.getItem('todo-tasks')
			if(!tasks) tasks = []
			else tasks = JSON.parse(tasks)
			this.setState({
				tasks: tasks
			})
		}
		catch(err) {
			console.log(err)
		}
	}

	async storeTasks(tasks){
		try {
			await AsyncStorage.setItem('todo-tasks', JSON.stringify(tasks))
		}
		catch(err) {
			console.log(err)
		}
	}

}

const styles = StyleSheet.create({
  container: {
	  backgroundColor: '#7940ed',
	  flex: 1
  },
  innerView: {
	  margin: 20
  },
  title: {
	  textAlign: 'center',
	  fontSize: 20,
	  fontWeight: 'bold',
	  marginTop: 50
  },
  newTask: {
	  borderBottomWidth: 1,
	  margin: 40,
	  padding: 5,
	  paddingBottom: 0,
	  fontSize: 25
  },
  listContent: {
	  flexDirection: 'row',
	  justifyContent: 'space-between'
  },
  close: {
	  paddingLeft: 10
  }
});
