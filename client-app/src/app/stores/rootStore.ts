import ActivityStore from "./activityStore";
import UserStore from "./userStore";
import { createContext } from "react";
import { configure } from "mobx";
import CommomStore from "./commomStore";
import ModalStore from "./modalStore";
import ProfileStore from "./profileStore";



configure({'enforceActions' : 'always'})

export class RootStore {
    activityStore : ActivityStore
    userStore : UserStore;
    commomStore : CommomStore;
    modalStore : ModalStore;
    profileStore : ProfileStore;

    constructor () {
        this.activityStore = new ActivityStore(this);
        this.userStore = new UserStore(this);
        this.commomStore = new CommomStore(this);
        this.modalStore = new ModalStore(this);
        this.profileStore = new ProfileStore(this);

    }

}

export const RootStoreContext = createContext(new RootStore());