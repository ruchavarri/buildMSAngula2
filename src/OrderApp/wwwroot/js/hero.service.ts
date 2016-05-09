import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Hero }           from './hero';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class HeroService {
    constructor(private http: Http) { }
    heroesUrl = "api/orders";  //js/heroes.json
    getHeroes(): Promise<Hero[]> {
        return this.http.get(this.heroesUrl)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }
    
    addHero(name: string): Promise<Hero> {
        let body = JSON.stringify({ name });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.heroesUrl, body, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }
    private extractData(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body = res.json();
        return body || {};
    }
    private handleError(error: any) {
        // In a real world app, we might send the error to remote logging infrastructure
        let errMsg = error.message || 'Server error';
        console.error(errMsg); // log to console instead
        return Promise.reject(errMsg);
    }

    //getHeroes() {
    //    return this.http.get('js/heroes.json')
    //        .map((res: Response) => res.json());

    //}
}
