import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IComboSelectionChangeEventArgs, IgxColumnComponent, IgxComboComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { Article } from 'src/app/_models/article';
import { Units } from 'src/app/_models/units';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { MasterService } from '_services/master.service';

@Component({
  selector: 'app-article-umo-conversion',
  templateUrl: './article-umo-conversion.component.html',
  styleUrls: ['./article-umo-conversion.component.css']
})
export class ArticleUmoConversionComponent implements OnInit {
  articleUOMForm: FormGroup;
  articleList: Article[];
  artUOMConvList: any[];
  UnitList: Units[];
  user: User;

  @ViewChild('uarticle', { read: IgxComboComponent })
  public uarticle: IgxComboComponent;
  @ViewChild('unit', { read: IgxComboComponent })
  public unit: IgxComboComponent;

  @ViewChild('articleUOMGrid', { static: true })
  public articleUOMGrid: IgxGridComponent;

  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;
  
  constructor(private fb: FormBuilder,
    private accountService: AccountService,
    private masterService: MasterService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initilizeForm();
    this.loadArticles();
    this.loadUnits();
  }

  initilizeForm() {
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
      //console.log(this.user.userId);
    });

    this.articleUOMForm = this.fb.group({
      autoId: [0],     
      uarticle: ['' , Validators.required],     
      unit: ['' , Validators.required],
      value: [0 ]     
    });   
  }

   //// ALOW SINGLE SILECTION ONLY COMBO EVENT
   singleSelection(event: IComboSelectionChangeEventArgs) {
    if (event.added.length) {
      event.newSelection = event.added;
    }
   }

  public onResize(event) {
    this.col = event.column;
    this.pWidth = event.prevWidth;
    this.nWidth = event.newWidth;
  }

  loadUnits() {
    this.masterService.getUnits().subscribe((result) => {
      this.UnitList = result;
    });
  }

  loadArticles() {
    this.masterService.getSCardArticles().subscribe((result) => {
      this.articleList = result;
    });
    // console.log(this.colorCard);
  }

  onSelectArticle(event) { 
    this.artUOMConvList = [];
    for (const item of event.added) {
      this.loadsArticleUOMConv(item); 
    }
  }

  loadsArticleUOMConv(articleId) {
    this.masterService.getArticleUOMConvAll(articleId).subscribe(result => {
      this.artUOMConvList = result
      // console.log(this.artUOMConvList);
    });   
  }

  saveArticleUOMConv() {
    var articleId = this.articleUOMForm.get("uarticle").value[0];
    var obj = {
      autoId: this.articleUOMForm.get("autoId").value,     
      articleId: articleId,
      unitId: this.articleUOMForm.get("unit").value[0],
      value: this.articleUOMForm.get("value").value,
      createUserId: this.user.userId,
    }

    // console.log(obj);
    this.masterService.saveArticleUOMConv(obj).subscribe(result => {
      if (result == 1) {
        this.toastr.success('Article UOM save successfully !!!'); 
        this.loadsArticleUOMConv(articleId);
        this.clearControls();      
      } else if (result['result'] == -1) {
        this.toastr.warning('Article value already exists !!!');
      } else {
        this.toastr.warning(
          'Contact Admin. Error No:- ' + result['result'].toString()
        );
      }
    })
  }

  clearControls() {
    this.articleUOMForm.get("autoId").setValue(0);
    // this.articleUOMForm.get("uarticle").setValue('');
    this.articleUOMForm.get("unit").setValue('');
    this.articleUOMForm.get("value").setValue(0);
  }  

  activeArticleUOM(event ,cellId) {
    const autoId = cellId.rowID;
    var articleId = this.articleUOMForm.get("uarticle").value[0];

    var obj = {
      autoId: autoId,
      createUserId: this.user.userId,
    }

    this.masterService.activeArticleUOMConv(obj).subscribe(result => {
      if (result == 1) {
        this.toastr.success('Article UOM active successfully !!!'); 
        this.loadsArticleUOMConv(articleId);
        //this.clearControls();      
      } else if (result == -1) {
        this.toastr.warning('Article UOM active fail !!!');
      } else {
        this.toastr.warning(
          'Contact Admin. Error No:- ' + result.toString()
        );
      }
    });
  }

}
