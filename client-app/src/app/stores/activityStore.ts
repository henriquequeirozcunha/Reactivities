import {observable, action, computed, configure , runInAction} from 'mobx';
import { createContext, SyntheticEvent } from 'react';
import { IActivity } from '../models/Activity';
import agent from '../api/agent';


configure({'enforceActions' : 'always'})

class ActivityStore {

    @observable activityRegistry = new Map();
    @observable activities : IActivity[] = [];
    @observable selectedAcitivity : IActivity | undefined; 
    @observable loadingInitial : boolean = false;
    @observable editMode : boolean = false;
    @observable submitting : boolean = false;
    @observable target : string = '';

    @computed get activitiesByDate() {
        return  Array.from(this.activityRegistry.values()).sort(
            (a , b) => Date.parse(a.date) - Date.parse(b.date)
            );
    }

    @action loadActivities = async () => {
        
        try {
            this.loadingInitial = true;
            const response = await agent.Activities.list();

            runInAction('Loading Activities...',  () => {
                let activities : IActivity[] = [];
    
                response.forEach(activity => {
                    activity.date = activity.date.split('.')[0];
                    activities.push(activity);
                    this.activityRegistry.set(activity.id, activity);
                });
                
                this.activities = activities;
                
            } );
        } 
        catch (error) {
            console.log(error);
            
        }
        finally {
            runInAction ('Loading activities error...', () => {
                this.loadingInitial = false;
            } )
        }
        
    }

    @action selectActivity = async (id : string) => {
        
        // this.selectedAcitivity = this.activities.find(a => a.id === id);
        this.selectedAcitivity = this.activityRegistry.get(id);

        this.editMode = false;
        
    }
    
    @action createActivity = async (activity : IActivity) => {
        
        this.submitting = true;

        try {
            await agent.Activities.create(activity);
            
            runInAction('Creating Activity', () => {

                this.activityRegistry.set(activity.id, activity);
                this.editMode = false;
                this.submitting = false;

            })

           
        } 
        catch (error) {
            console.log(error);
            
        }
        finally
        {
            runInAction('Creating Activity error...',  () => {
                this.submitting = false;

            } )
        }
        
    }

    @action editActivity = async (activity : IActivity) => {
        
        this.submitting = true;

        try {
            await agent.Activities.update(activity);

            runInAction('Editing Activity',  () => {

                this.activityRegistry.set(activity.id, activity);
                this.selectedAcitivity = this.activityRegistry.get(activity.id);
                this.editMode = false;
                this.submitting = false;
            })

        } 
        catch (error) {
            console.log(error);
            
        }
        finally
        {
            runInAction('Editing Activity Error', () => {

                this.submitting = false;
            })
        }
        
    }

    @action deleteActivity = async ( event : SyntheticEvent<HTMLButtonElement> , id : string) => {
        
        this.submitting = true;
        this.target = event.currentTarget.name;

        try {
            await agent.Activities.delete(id);
            
            runInAction('Deleting Activity', () => {

                this.activityRegistry.delete(id);
                this.submitting = false;
                this.target = '';
            })
        } 
        catch (error) {
            console.log(error);
            
        }
        finally
        {
            runInAction('Deleting Acitivity Error', () => {

                this.submitting = false;
                this.target = '';
            })
        }
        
    }

    @action openCreateForm = () => {
       this.editMode = true;
       this.selectedAcitivity = undefined;

    }

    @action cancelSelectedActivity = () => {
        this.selectedAcitivity = undefined;
     }

    @action openEditForm = (id : string) => {
        this.selectedAcitivity = this.activityRegistry.get(id);
        this.editMode = true;
 
     }
     
     @action cancelFormOpen = () => {
        this.editMode = false;
 
     }
     
    

}

export default createContext(new ActivityStore())