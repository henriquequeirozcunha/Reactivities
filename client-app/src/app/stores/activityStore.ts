import { observable, action, computed, runInAction } from "mobx";
import { SyntheticEvent } from "react";
import { IActivity } from "../models/Activity";
import agent from "../api/agent";
import { history } from "../../index";
import { RootStore } from "./rootStore";
import { setActivityProps, createAttendee } from "../commom/util/util";
import { toast } from "react-toastify";
import {HubConnection, HubConnectionBuilder, LogLevel} from '@microsoft/signalr';

export default class ActivityStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable activityRegistry = new Map();
  @observable activity: IActivity | null = null;
  @observable activities: IActivity[] = [];
  @observable loadingInitial: boolean = false;
  @observable submitting: boolean = false;
  @observable target: string = "";

  @observable loading: boolean = false;

  @observable.ref hubConneciton : HubConnection  | null = null;

  

  @computed get activitiesByDate() {
    return this.groupActivitiesByDate(
      Array.from(this.activityRegistry.values())
    );
  }

@action createHubConnection = (activityId : string) => {

  
  this.hubConneciton = new HubConnectionBuilder()
  .withUrl('http://localhost:5000/chat', {
    accessTokenFactory : () => this.rootStore.commomStore.token!
  })
  .configureLogging(LogLevel.Information)
  .build();

  this.hubConneciton.start()
  .then(() => {
    console.log(this.hubConneciton!.state)
  })
  .then(() => {
     console.log('Tentando conectar com o ChatHub(SignalR)....');

     if(this.hubConneciton?.state)
     this.hubConneciton?.invoke('AddToGroup', activityId);
  })
  .catch((error) => {
    console.log('Erro ao abrir conexão SignalR: ', error);
  })

  this.hubConneciton.on('ReceiveComment', (comment) => {
    runInAction(() => {
      this.activity!.comments.push(comment);

    })
  })

 this.hubConneciton.on('Send', message => {
   toast.info(message);
 })
}

@action stopHubConnection = () => {
  this.hubConneciton?.invoke('RemoveFromGroup', this.activity?.id)
      .then(() => {
        this.hubConneciton?.stop();
      })
      .then(() => console.log('Connection has stopped'))
      .catch(err => console.log(err));
      
}

@action addComment = async (values : any) => {
    values.activityId = this.activity?.id;
    try {
      await this.hubConneciton!.invoke('SendComment', values)
      
    } catch (error) {
       console.log(error);
    }
}

  groupActivitiesByDate(activities: IActivity[]) {
    const sortedActivities = activities.sort(
      (a, b) => a.date!.getTime() - b.date!.getTime()
    );

    return Object.entries(
      sortedActivities.reduce((activities, activity) => {
        const date = activity.date!.toISOString().split("T")[0];

        activities[date] = activities[date]
          ? [...activities[date], activity]
          : [activity];

        return activities;
      }, {} as { [key: string]: IActivity[] })
    );
  }

  getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  };

  @action loadActivity = async (id: string) => {
    let activity = this.getActivity(id);

    if (activity) {
      this.activity = activity;
      return this.activity;
    } else {
      this.loadingInitial = true;
      try {
        activity = await agent.Activities.details(id);
        runInAction("getting Activity", () => {
          this.activity = activity;
          activity = setActivityProps(activity, this.rootStore.userStore.user!);
          this.activityRegistry.set(activity.id, activity);
          this.loadingInitial = false;
        });

        return activity;
      } catch (error) {
        runInAction("get Activity Error", () => {
          this.loadingInitial = false;
        });
        console.log(error);
      }
    }
  };

  @action loadActivities = async () => {
    this.loadingInitial = true;

    try {
      const activities = await agent.Activities.list();
      runInAction("Loading Activities...", () => {
        activities.forEach((activity: IActivity) => {
          activity = setActivityProps(activity, this.rootStore.userStore.user!);
          this.activityRegistry.set(activity.id, activity);
        });
        this.loadingInitial = false;
      });
    } catch (error) {
      console.log(error);
      runInAction("Loading activities error...", () => {
        this.loadingInitial = false;
      });
    }
  };

  @action selectActivity = async (id: string) => {
    // this.selectedAcitivity = this.activities.find(a => a.id === id);
    this.activity = this.activityRegistry.get(id);
  };

  @action createActivity = async (activity: IActivity) => {
    this.submitting = true;

    try {
      await agent.Activities.create(activity);
      const attendee = createAttendee(this.rootStore.userStore.user!);

      attendee.isHost = true;
      let attendeees = [];
      attendeees.push(attendee);
      activity.attendees = attendeees;
      activity.isHost = true;
      activity.comments = [];

      runInAction("Creating Activity", () => {
        this.activityRegistry.set(activity.id, activity);
        this.submitting = false;
      });
      history.push(`/activities/${activity.id}`);
    } catch (error) {
      console.log(error);
    } finally {
      runInAction("Creating Activity error...", () => {
        this.submitting = false;
      });
    }
  };

  @action editActivity = async (activity: IActivity) => {
    this.submitting = true;

    try {
      await agent.Activities.update(activity);

      runInAction("Editing Activity", () => {
        this.activityRegistry.set(activity.id, activity);
        this.activity = this.activityRegistry.get(activity.id);
        this.submitting = false;
      });
      history.push(`/activities/${activity.id}`);
    } catch (error) {
      console.log(error);
    } finally {
      runInAction("Editing Activity Error", () => {
        this.submitting = false;
      });
    }
  };

  @action deleteActivity = async (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    this.submitting = true;
    this.target = event.currentTarget.name;

    try {
      await agent.Activities.delete(id);

      runInAction("Deleting Activity", () => {
        this.activityRegistry.delete(id);
        this.submitting = false;
        this.target = "";
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction("Deleting Acitivity Error", () => {
        this.submitting = false;
        this.target = "";
      });
    }
  };

  @action openCreateForm = () => {
    this.activity = null;
  };

  @action cancelSelectedActivity = () => {
    this.activity = null;
  };

  @action openEditForm = (id: string) => {
    this.activity = this.activityRegistry.get(id);
  };

  @action clearActivity = () => {
    this.activity = null;
  };

  @action attendActivity = async () => {
    const attendee = createAttendee(this.rootStore.userStore.user!);
    this.loading = true;
    try {
      await agent.Activities.attend(this.activity!.id);

      runInAction(() => {
        if (this.activity) {
          this.activity.attendees.push(attendee);
          this.activity.isGoing = true;
          this.activityRegistry.set(this.activity.id, this.activity);
        }

        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      toast.error("Problem siging up to activity");
    }
  };

  @action cancelAttendance = async () => {
    this.loading = true;

    try {
      await agent.Activities.unattend(this.activity!.id);

      runInAction(() => {
        if (this.activity) {
          this.activity.attendees = this.activity.attendees.filter(
            (a) => a.username !== this.rootStore.userStore.user?.userName
          );
          this.activity.isGoing = false;
          this.activityRegistry.set(this.activity.id, this.activity);
        }
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      toast.error("Problem cancelling activity");
    }
  };
}
