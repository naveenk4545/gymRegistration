import { Component, OnInit } from '@angular/core';
import { user } from '../models/user.model';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit{
  public userId!:number;
  userDetails!:user;
  constructor( private activateRoute:ActivatedRoute,private api:ApiService){

  }
  ngOnInit(): void {
    this.activateRoute.params.subscribe(val=>{
      this.userId=val['id'];
      this.fetchUserDetails(this.userId);
    })
  }

  fetchUserDetails(userId:number){
    this.api.getRegisteredUserId(userId)
    .subscribe(res=>{
      this.userDetails=res;
    })
  }

}
