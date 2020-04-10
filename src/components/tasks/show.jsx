import React, { Component } from 'react';
import {
  Page,
  Navbar,
  List,
  ListItem,
  ListInput,
  Toggle,
  BlockTitle,
  Row,
  Button,
  Range,
  Block,
  Icon, Fab
} from 'framework7-react';
import { dict } from '../../Dict';
import ModelStore from "../../stores/ModelStore";
import * as MyActions from "../../actions/MyActions";
import TaskShow from "../../containers/tasks/show"

export default class Layout extends Component {
  constructor() {
    super();
    this.getInstance = this.getInstance.bind(this);
    this.getList = this.getList.bind(this);
    this.submit = this.submit.bind(this);
    this.handleChangeValue = this.handleChangeValue.bind(this);
    this.removeTask = this.removeTask.bind(this);
    this.addAbility = this.addAbility.bind(this);
    this.removeAbility = this.removeAbility.bind(this);
    this.searchProfile = this.searchProfile.bind(this);
    this.addProfile = this.addProfile.bind(this);
    this.removeProfile = this.removeProfile.bind(this);
    
    this.state = {
      token: window.localStorage.getItem('token'),
      task: null,
      id: null,
      users: null,
      assignedUsers: null,
      user_id: null,
      abilityTitle: '',
      abilityValue: true,
      ability: null,
      query: null,
      profiles: [],
    }
  }

  componentWillMount() {
    ModelStore.on("got_instance", this.getInstance);
    ModelStore.on("set_instance", this.getInstance);
    ModelStore.on("got_list", this.getList);
    ModelStore.on("deleted_instance", this.getInstance);
  }

  componentWillUnmount() {
    ModelStore.removeListener("got_instance", this.getInstance);
    ModelStore.removeListener("set_instance", this.getInstance);
    ModelStore.removeListener("got_list", this.getList);
    ModelStore.removeListener("deleted_instance", this.getInstance);
  }

  componentDidMount() {
    MyActions.getInstance('tasks', this.$f7route.params['taskId'], this.state.token);
    MyActions.getList('users', this.state.page, {}, this.state.token);
  }

  getInstance() {
    var task = ModelStore.getIntance()
    var klass = ModelStore.getKlass()
    if (task && klass === 'Task') {
      this.setState({
        task: task,
        id: task.id,
        assignedUsers: task.users,
        ability: task.ability
      });
    }
  }

  getList() {
    var list = ModelStore.getList()
    var klass = ModelStore.getKlass()
    if (list && klass === 'User') {
      this.setState({
        users: list,
      });
    }
    if (list && klass === 'Profile') {
      this.setState({
        profiles: list,
      });
    }
    console.log(list)
  }

  submit() {
    var data = { task_id: this.state.id, user_id: this.state.user_id }
    MyActions.setInstance('users/assignments', data, this.state.token);
  }

  searchProfile(obj){
    this.setState({ profiles: []});
    this.setState(obj, () => {
      MyActions.getList('profiles/search', this.state.page, {q: this.state.query});
  });  
  }

  addProfile(profileId){
    var data = { id: this.state.id, profile_id: profileId}
    MyActions.setInstance('tasks/participants', data, this.state.token);
  }

  removeProfile(profileId) {
    var data = { id: this.state.id, profile_id: profileId}
    MyActions.removeInstance('tasks/participants', data, this.state.token);
  }

  addAbility() {
    var data = { id: this.state.id, ability_title: this.state.abilityTitle, ability_value: this.state.abilityValue}
    MyActions.setInstance('tasks/abilities', data, this.state.token);
  }

  handleChangeValue(obj) {
    this.setState(obj);
  }

  fab() {
    if (this.state.task) {
      return (
        <Fab href={"/tasks/" + this.state.task.id + "/edit"} target="#main-view" position="left-bottom" slot="fixed" color="lime">
          <Icon ios="f7:edit" aurora="f7:edit" md="material:edit"></Icon>
          <Icon ios="f7:close" aurora="f7:close" md="material:close"></Icon>
        </Fab>
      )
    }
  }

  removeTask(user_id) {
    MyActions.removeInstance('users/assignments', { user_id: user_id, task_id: this.state.id }, this.state.token);
  }

  removeAbility(title){
    MyActions.removeInstance('tasks/abilities', { id: this.state.id, title: title }, this.state.token);
  }

  render() {
    const { task, users, assignedUsers, ability, profiles } = this.state;
    return (
      <Page>
        <Navbar title={dict.tasks} backLink={dict.back} />
        <BlockTitle></BlockTitle>
        {this.fab()}
        <TaskShow task={task} users={users} ability={ability} profiles={profiles} removeProfile={this.removeProfile} addProfile={this.addProfile} searchProfile={this.searchProfile} removeAbility={this.removeAbility} assignedUsers={assignedUsers} addAbility={this.addAbility} removeTask={this.removeTask} submit={this.submit} handleChange={this.handleChangeValue} />
      </Page>
    );
  }
}
