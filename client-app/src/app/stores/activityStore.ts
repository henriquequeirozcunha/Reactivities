import {observable, action, computed, configure , runInAction} from 'mobx';
import { createContext, SyntheticEvent } from 'react';
import { IActivity } from '../models/Activity';
import agent from '../api/agent';


configure({'enforceActions' : 'always'})

class ActivityStore {

    @observable activityRegistry = new Map();
    @observable activity : IActivity | null = null; 
    @observable loadingInitial : boolean = false;
    @observable submitting : boolean = false;
    @observable target : string = '';

    @computed get activitiesByDate() {
        return  this.groupActivitiesByDate(Array.from(this.activityRegistry.values()));
    }

    groupActivitiesByDate (activities : IActivity[]) {
        const sortedActivities =  activities.sort(
            (a , b) => Date.parse(a.date) - Date.parse(b.date)
            );

        return Object.entries(sortedActivities.reduce((activities, activity) => {
            const date = activity.date.split('T')[0];

            activities[date] = activities[date] ? [...activities[date], activity] : [activity];

            return activities;

        }, {} as { [key: string] : IActivity[] }));
    }


    getActivity = (id : string) => {
        return this.activityRegistry.get(id);
    }

    @action loadActivity = async (id : string) => {
        let activity = this.getActivity(id);

        if(activity){
            this.activity = activity;
        }
        else {
            this.loadingInitial = true;
            try {
                activity = await agent.Activities.details(id);
                runInAction('getting Activity', () => {
                    this.activity = activity;
                })
            } catch (error) {
                runInAction('get Activity Error', () => {
                    this.loadingInitial = false;
                })
                console.log(error);
            }
            

        }
    }


    @action loadActivities = async () => {
        
        try {
            this.loadingInitial = true;
            const activities = await agent.Activities.list();
            runInAction('Loading Activities...',  () => {
    
                activities.forEach(activity => {
                    activity.date = activity.date.split('.')[0];
                    this.activityRegistry.set(activity.id, activity);
                });
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
        this.activity = this.activityRegistry.get(id);
        
    }
    
    @action createActivity = async (activity : IActivity) => {
        
        this.submitting = true;

        try {
            await agent.Activities.create(activity);
            
            runInAction('Creating Activity', () => {

                this.activityRegistry.set(activity.id, activity);
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
                this.activity = this.activityRegistry.get(activity.id);
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
       this.activity = null;

    }

    @action cancelSelectedActivity = () => {
        this.activity = null;
     }

    @action openEditForm = (id : string) => {
        this.activity = this.activityRegistry.get(id);
        
 
     }
    

     @action clearActivity = () => {
         this.activity = null;
     }
     
    

}

export default createContext(new ActivityStore())