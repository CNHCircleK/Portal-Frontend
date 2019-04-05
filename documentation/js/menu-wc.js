'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">portal documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                        <li class="link">
                            <a href="dependencies.html" data-type="chapter-link">
                                <span class="icon ion-ios-list"></span>Dependencies
                            </a>
                        </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse" ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link">AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-d6326a67c87e922c7415e09cff84cb5d"' : 'data-target="#xs-components-links-module-AppModule-d6326a67c87e922c7415e09cff84cb5d"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-d6326a67c87e922c7415e09cff84cb5d"' :
                                            'id="xs-components-links-module-AppModule-d6326a67c87e922c7415e09cff84cb5d"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CerfComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CerfComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CerfListComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CerfListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ClubAdministrationComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ClubAdministrationComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ClubsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ClubsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ConfirmDialogComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ConfirmDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DivisionsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DivisionsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FAQsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FAQsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LoginComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LoginComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MrfComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MrfComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MrfDistrictComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MrfDistrictComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MrfDivisionComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MrfDivisionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MrfListComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MrfListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MrfSecretaryComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MrfSecretaryComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MyCerfsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MyCerfsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProfileComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ProfileComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SettingsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SettingsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SignupComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SignupComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#pipes-links-module-AppModule-d6326a67c87e922c7415e09cff84cb5d"' : 'data-target="#xs-pipes-links-module-AppModule-d6326a67c87e922c7415e09cff84cb5d"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-AppModule-d6326a67c87e922c7415e09cff84cb5d"' :
                                            'id="xs-pipes-links-module-AppModule-d6326a67c87e922c7415e09cff84cb5d"' }>
                                            <li class="link">
                                                <a href="pipes/ClubIDPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ClubIDPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/DivisionIDPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DivisionIDPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/MemberIDPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MemberIDPipe</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link">AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/CoreModule.html" data-type="entity-link">CoreModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/MaterialsModule.html" data-type="entity-link">MaterialsModule</a>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#components-links"' :
                            'data-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/CerfComponent.html" data-type="entity-link">CerfComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CerfListComponent.html" data-type="entity-link">CerfListComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ClubAdministrationComponent.html" data-type="entity-link">ClubAdministrationComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ClubsComponent.html" data-type="entity-link">ClubsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ConfirmDialogComponent.html" data-type="entity-link">ConfirmDialogComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DialogNewClub.html" data-type="entity-link">DialogNewClub</a>
                            </li>
                            <li class="link">
                                <a href="components/DialogNewMember.html" data-type="entity-link">DialogNewMember</a>
                            </li>
                            <li class="link">
                                <a href="components/DivisionsComponent.html" data-type="entity-link">DivisionsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FAQsComponent.html" data-type="entity-link">FAQsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/InfoDialog.html" data-type="entity-link">InfoDialog</a>
                            </li>
                            <li class="link">
                                <a href="components/LoginComponent.html" data-type="entity-link">LoginComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MrfComponent.html" data-type="entity-link">MrfComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MrfDistrictComponent.html" data-type="entity-link">MrfDistrictComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MrfDivisionComponent.html" data-type="entity-link">MrfDivisionComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MrfListComponent.html" data-type="entity-link">MrfListComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MrfSecretaryComponent.html" data-type="entity-link">MrfSecretaryComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MyCerfsComponent.html" data-type="entity-link">MyCerfsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ProfileComponent.html" data-type="entity-link">ProfileComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SettingsComponent.html" data-type="entity-link">SettingsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SignupComponent.html" data-type="entity-link">SignupComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TagsDialog.html" data-type="entity-link">TagsDialog</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#directives-links"' :
                                'data-target="#xs-directives-links"' }>
                                <span class="icon ion-md-code-working"></span>
                                <span>Directives</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse" ${ isNormalMode ? 'id="directives-links"' : 'id="xs-directives-links"' }>
                                <li class="link">
                                    <a href="directives/EqualValidator.html" data-type="entity-link">EqualValidator</a>
                                </li>
                                <li class="link">
                                    <a href="directives/NewFocusInput.html" data-type="entity-link">NewFocusInput</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/Cerf.html" data-type="entity-link">Cerf</a>
                            </li>
                            <li class="link">
                                <a href="classes/CerfListEntry.html" data-type="entity-link">CerfListEntry</a>
                            </li>
                            <li class="link">
                                <a href="classes/Maker.html" data-type="entity-link">Maker</a>
                            </li>
                            <li class="link">
                                <a href="classes/Member.html" data-type="entity-link">Member</a>
                            </li>
                            <li class="link">
                                <a href="classes/Mrf.html" data-type="entity-link">Mrf</a>
                            </li>
                            <li class="link">
                                <a href="classes/MrfListEntry.html" data-type="entity-link">MrfListEntry</a>
                            </li>
                            <li class="link">
                                <a href="classes/MrfReuseStrategy.html" data-type="entity-link">MrfReuseStrategy</a>
                            </li>
                            <li class="link">
                                <a href="classes/User.html" data-type="entity-link">User</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/ApiService.html" data-type="entity-link">ApiService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link">AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CerfService.html" data-type="entity-link">CerfService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MemberService.html" data-type="entity-link">MemberService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MrfService.html" data-type="entity-link">MrfService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RequestCache.html" data-type="entity-link">RequestCache</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interceptors-links"' :
                            'data-target="#xs-interceptors-links"' }>
                            <span class="icon ion-ios-swap"></span>
                            <span>Interceptors</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? 'id="interceptors-links"' : 'id="xs-interceptors-links"' }>
                            <li class="link">
                                <a href="interceptors/CacheInterceptor.html" data-type="entity-link">CacheInterceptor</a>
                            </li>
                            <li class="link">
                                <a href="interceptors/ContentTypeInterceptor.html" data-type="entity-link">ContentTypeInterceptor</a>
                            </li>
                            <li class="link">
                                <a href="interceptors/ErrorInterceptor.html" data-type="entity-link">ErrorInterceptor</a>
                            </li>
                            <li class="link">
                                <a href="interceptors/FakeBackendInterceptor.html" data-type="entity-link">FakeBackendInterceptor</a>
                            </li>
                            <li class="link">
                                <a href="interceptors/TokenInterceptor.html" data-type="entity-link">TokenInterceptor</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#guards-links"' :
                            'data-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AuthGuard.html" data-type="entity-link">AuthGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/CerfNavResolver.html" data-type="entity-link">CerfNavResolver</a>
                            </li>
                            <li class="link">
                                <a href="guards/ClubsResolver.html" data-type="entity-link">ClubsResolver</a>
                            </li>
                            <li class="link">
                                <a href="guards/ExitGuard.html" data-type="entity-link">ExitGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/MembersResolver.html" data-type="entity-link">MembersResolver</a>
                            </li>
                            <li class="link">
                                <a href="guards/MrfDeactivateGuard.html" data-type="entity-link">MrfDeactivateGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/MrfDistrictResolver.html" data-type="entity-link">MrfDistrictResolver</a>
                            </li>
                            <li class="link">
                                <a href="guards/MrfDivisionResolver.html" data-type="entity-link">MrfDivisionResolver</a>
                            </li>
                            <li class="link">
                                <a href="guards/MrfPendingCerfResolver.html" data-type="entity-link">MrfPendingCerfResolver</a>
                            </li>
                            <li class="link">
                                <a href="guards/MrfSecretaryResolver.html" data-type="entity-link">MrfSecretaryResolver</a>
                            </li>
                            <li class="link">
                                <a href="guards/MyCerfsResolver.html" data-type="entity-link">MyCerfsResolver</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/CanComponentDeactivate.html" data-type="entity-link">CanComponentDeactivate</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CanComponentDeactivate-1.html" data-type="entity-link">CanComponentDeactivate</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Response.html" data-type="entity-link">Response</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RouteStorageObject.html" data-type="entity-link">RouteStorageObject</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#pipes-links"' :
                                'data-target="#xs-pipes-links"' }>
                                <span class="icon ion-md-add"></span>
                                <span>Pipes</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links"' : 'id="xs-pipes-links"' }>
                                <li class="link">
                                    <a href="pipes/ClubIDPipe.html" data-type="entity-link">ClubIDPipe</a>
                                </li>
                                <li class="link">
                                    <a href="pipes/DivisionIDPipe.html" data-type="entity-link">DivisionIDPipe</a>
                                </li>
                                <li class="link">
                                    <a href="pipes/MemberIDPipe.html" data-type="entity-link">MemberIDPipe</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});