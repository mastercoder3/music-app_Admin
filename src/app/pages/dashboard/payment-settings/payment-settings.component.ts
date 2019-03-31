import { Component, OnInit } from '@angular/core';
import { HelperService } from 'src/app/services/helper/helper.service';
import { ApiService } from 'src/app/services/api/api.service';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-payment-settings',
  templateUrl: './payment-settings.component.html',
  styleUrls: ['./payment-settings.component.css']
})
export class PaymentSettingsComponent implements OnInit {

  payment;
  pay;
  coupons;
  c = {
    name: '',
    discount: 0,
    date: null
  };
  showSpinner = true;

  constructor(private helper: HelperService, private api: ApiService, private toastr: ToastrService) { }

  ngOnInit() {
    this.getData();
  }

  getData(){
    this.api.getCoupons()
      .pipe(map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const did  =  a.payload.doc.id;
         return {did, ...data};
      })))
      .subscribe(res => {
        this.coupons = res;
        this.coupons = this.coupons.filter(data => data.did !== 'amount');
        this.showSpinner = false;
      })

    this.api.getPayment()
      .subscribe(res => {
        this.pay = res;
        this.payment = this.pay.amount;
      })
  }

  addCoupon(content){
    this.helper.openModelLg(content);
  }

  setPayment(content){
    this.helper.openModelLg(content);
  }

  delete(item){
    if(confirm(`Are you sure you want to Delete ${item.name}`)){
      this.api.deleteCoupon(item.did)
        .then(res => {
          this.toastr.success('Coupon delted.','Operation Completed Successfully');
        }, err => {
          this.toastr.error(err.message, 'Error!');
        })
    }
  }

  addNewCoupon(){
    if(this.c.name !== '' && this.c.date !== '' && this.c.discount > 0){
      this.c.date = new Date(this.c.date);
      this.api.addCoupon(this.c)
        .then(res =>{
          this.helper.closeModel();
          this.toastr.success('Coupon Added Successfully', 'Operation Completed');
        }, err =>{
          this.toastr.error(err.message, 'Error!');
        })
    }
    else{
      this.toastr.warning('Please Fill the details right.', 'Could not Proceed');
    }
  }

  savePayment(){
    if(this.payment && this.payment > 0){
      this.api.updatePayment({amount: this.payment})
        .then(res =>{
          this.toastr.success('Payment Updated.','Operataion Completed.');
          this.helper.closeModel();
        }, err => {
          this.toastr.error(err.message, 'Error.')
        })
    }
  }

}
