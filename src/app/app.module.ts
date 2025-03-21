import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { HeaderComponent } from './header/header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoadingComponent } from './shared/loading/loading.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { BlogComponent } from './blogs/blog/blog.component';
import { BlogDetailsComponent } from './blogs/blog-details/blog-details.component';
import { TruncatePipe } from './blogs/truncate.pipe';
import { ErrorPageComponent } from './error-page/error-page.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [AppComponent, AuthComponent, HeaderComponent, LoadingComponent, LoginComponent, SignupComponent, BlogComponent, BlogDetailsComponent, TruncatePipe, ErrorPageComponent, FooterComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
