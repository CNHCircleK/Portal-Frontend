import { RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';

/*
Reference: https://stackoverflow.com/questions/41280471/how-to-implement-routereusestrategy-shoulddetach-for-specific-routes-in-angular
*/

/** Interface for object which can store both: 
 * An ActivatedRouteSnapshot, which is useful for determining whether or not you should attach a route (see this.shouldAttach)
 * A DetachedRouteHandle, which is offered up by this.retrieve, in the case that you do want to attach the stored route
 */
interface RouteStorageObject {
    snapshot: ActivatedRouteSnapshot;
    handle: DetachedRouteHandle;
}

export class MrfReuseStrategy implements RouteReuseStrategy {
	/** 
     * Object which will store RouteStorageObjects indexed by keys, which are paths (route.routeConfig.path)
     */
    private storedRoutes: { [key: string]: RouteStorageObject } = {};

    private routesToStore: string[] = ['mrf/:year/:month'];

    private saveMrf: boolean;
    private loadMrf: boolean;

    shouldDetach(route: ActivatedRouteSnapshot): boolean {
    	if(this.routesToStore.indexOf(route.routeConfig.path) > -1 && this.saveMrf)
    		return true;
    	return false;
    }

    store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    	let storedRoute: RouteStorageObject = { snapshot: route, handle: handle };
    	this.storedRoutes[route.routeConfig.path] = storedRoute;	// Will store in key "mrf/:year/:month", WILL override, which we want anyways
    }

    shouldAttach(route: ActivatedRouteSnapshot): boolean {
    	let canAttach = !!route.routeConfig && !!this.storedRoutes[route.routeConfig.path];

    	if(canAttach && this.loadMrf) {
    		// route.params: {year: "2018", month: "7"}
    		// route.queryParams: {}
    		/* storedRoutes.snapshot:
    				params: {year: "2018", month: "7"}
    				queryParams: {}
    				routeConfig: 
	    				canActivate: [AuthGuard]
						component: MrfComponent
						path: "mrf/:year/:month"
						resolve: mrf: MrfResolver
					url (UrlSegments):
						[0] "mrf" [1] "2018" [2] "7"
    		*/

    		return this.compareObjects(route.params, this.storedRoutes[route.routeConfig.path].snapshot.params) &&
    			this.compareObjects(route.queryParams, this.storedRoutes[route.routeConfig.path].snapshot.queryParams);
    	}
    	return false;
    }

    updateEvents() {

    }

    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    	if(!route.routeConfig || !this.storedRoutes[route.routeConfig.path]) return null;
        console.log(this.storedRoutes[route.routeConfig.path]);
    	return this.storedRoutes[route.routeConfig.path].handle;
    }

    /** 
     * Determines whether or not the current route should be reused
     * @param curr The route the user was on
     * @param future The route the user is going to, as triggered by the router
     * @returns boolean basically indicating true if the user intends to leave the current route
     */
    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    	// if(future.routeConfig.path == "mrf/:year/:month" && curr.routeConfig.path == "cerf/:id") {
    	// 	console.log("trying to reload MRF ");
    	// 	return true;
    	// }
    	if(curr.routeConfig && future.routeConfig) {
    		if(curr.routeConfig.path == "mrf/:year/:month" && future.routeConfig.path == "cerf/:id") {
    			this.saveMrf = true;	// Want to save if going into a CERF from MRF
    		}
    		else if (curr.routeConfig.path == "cerf/:id" && future.routeConfig.path == "mrf/:year/:month") {
    			this.loadMrf = true;	// Want to load if going back to MRF from CERF
    		}
    		else {
    			this.storedRoutes = {};
    			this.saveMrf = false;
    			this.loadMrf = false;
    		}
    	}
    	return future.routeConfig === curr.routeConfig;
    }

    /** 
     * This nasty bugger finds out whether the objects are _traditionally_ equal to each other, like you might assume someone else would have put this function in vanilla JS already
     * One thing to note is that it uses coercive comparison (==) on properties which both objects have, not strict comparison (===)
     * Another important note is that the method only tells you if `compare` has all equal parameters to `base`, not the other way around
     * @param base The base object which you would like to compare another object to
     * @param compare The object to compare to base
     * @returns boolean indicating whether or not the objects have all the same properties and those properties are ==
     */
    private compareObjects(base: any, compare: any): boolean {

        // loop through all properties in base object
        for (let baseProperty in base) {

            // determine if comparrison object has that property, if not: return false
            if (compare.hasOwnProperty(baseProperty)) {
                switch(typeof base[baseProperty]) {
                    // if one is object and other is not: return false
                    // if they are both objects, recursively call this comparison function
                    case 'object':
                        if ( typeof compare[baseProperty] !== 'object' || !this.compareObjects(base[baseProperty], compare[baseProperty]) ) { return false; } break;
                    // if one is function and other is not: return false
                    // if both are functions, compare function.toString() results
                    case 'function':
                        if ( typeof compare[baseProperty] !== 'function' || base[baseProperty].toString() !== compare[baseProperty].toString() ) { return false; } break;
                    // otherwise, see if they are equal using coercive comparison
                    default:
                        if ( base[baseProperty] != compare[baseProperty] ) { return false; }
                }
            } else {
                return false;
            }
        }

        // returns true only after false HAS NOT BEEN returned through all loops
        return true;
    }
}