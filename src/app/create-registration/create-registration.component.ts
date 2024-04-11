import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { NgToastService } from 'ng-angular-popup';
import { ActivatedRoute, Router } from '@angular/router';
import { user } from '../models/user.model';

@Component({
  selector: 'app-create-registration',
  templateUrl: './create-registration.component.html',
  styleUrls: ['./create-registration.component.scss'],
})
export class CreateRegistrationComponent {
  public packages: string[] = ['Monthly', 'quarterly', 'yearly'];
  public gender: string[] = ['Male', 'Female'];
  public trainerOpt: string[] = ['Yes', 'No'];
  public importantList: string[] = [
    'Toxic Fat reduction',
    'Energy and Endurance',
    'Building Lean Muscle',
    'Healthier Digetsive System',
    'Sugar Craving Body',
    'Fitness',
  ];
  public gymHistory: string[] = ['Yes', 'No'];

  public registerForm!: FormGroup;
  public userIdToUpdate!: number;
  public isUpdateActive: boolean = false;
  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router:Router,
    private toastService: NgToastService,
    private activateRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      mobile: [''],
      weight: [''],
      height: [''],
      bmi: [''],
      bmiResult: [''],
      gender: [''],
      requireTrainer: [''],
      package: [''],
      important: [''],
      haveGymBefore: [''],
      chooseDate: [''],
    });

    this.registerForm.controls['height'].valueChanges.subscribe((res) => {
      this.calculateBmi(res);
    });

    this.activateRoute.params.subscribe((val) => {
      this.userIdToUpdate = val['id'];
      this.api.getRegisteredUserId(this.userIdToUpdate).subscribe((res) => {
        this.isUpdateActive = true;
        this.fillFormToUpdate(res);
      });
    });
  }
  submit() {
    this.api.postRegisteration(this.registerForm.value).subscribe((res) => {
      this.toastService.success({
        detail: 'success',
        summary: 'Enquiry added',
        duration: 3000,
      });
      this.registerForm.reset();
    });
  }
  update(){
    this.api.updateRegisterUser(this.registerForm.value,this.userIdToUpdate)
    .subscribe(res=>{
      this.toastService.success({detail:'successs',summary:'Enquiry added',duration:3000});
      this.registerForm.reset();
      this.router.navigate(['list']);
    })
  }
  calculateBmi(heightValue: number) {
    const weight = this.registerForm.value.height;
    const height = heightValue;
    const bmi = weight / (height * height);
    this.registerForm.controls['bmi'].patchValue(bmi);
    switch (true) {
      case bmi < 18.5:
        this.registerForm.controls['bmiResult'].patchValue('underWeight');
        break;
      case bmi >= 18.5 && bmi < 25:
        this.registerForm.controls['bmiResult'].patchValue('normal');
        break;
      case bmi >= 25 && bmi < 30:
        this.registerForm.controls['bmiResult'].patchValue('overWeight');
        break;
      default:
        this.registerForm.controls['bmiResult'].patchValue('Obese');
    }
  }
  fillFormToUpdate(user: user) {
    this.registerForm.setValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobile: user.mobile,
      weight: user.weight,
      height: user.height,
      bmi: user.bmi,
      bmiResult: user.bmiResult,
      gender: user.gender,
      requireTrainer: user.requireTrainer,
      package: user.package,
      important: user.important,
      haveGymBefore: user.haveGymBefore,
      chooseDate: user.chooseDate,
    });
  }
}
