import { lazy, Suspense } from 'react'
import { Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'

const HomePage = lazy(() => import('../pages/HomePage'));
const LoanApplication = lazy(() => import('../pages/LoanApplication'));
const PersonalInfoForm = lazy(() => import('../components/forms/PersonalInfoForm'));
const FinancialInfoForm = lazy(() => import('../components/forms/FinancialInfoForm'));
const LoanDetailsForm = lazy(() => import('../components/forms/LoanDetailsForm'));
const EligibilityResults = lazy(() => import('../components/results/EligibilityResults'))

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={
            <Suspense fallback={<div>Loading...</div>}>
                <MainLayout />
            </Suspense>
        }>
            <Route index element={
                <Suspense fallback={<div>Loading...</div>}>
                    <HomePage />
                </Suspense>
            } />,
            <Route path="/loan-application" element={
                <Suspense fallback={<div>Loading...</div>}>
                    <LoanApplication />
                </Suspense>
            }>
                <Route index element={
                    <Suspense fallback={<div>Loading...</div>}>
                        <PersonalInfoForm />
                    </Suspense>
                } />,
                <Route path="financial-information" element={
                    <Suspense fallback={<div>Loading...</div>}>
                        <FinancialInfoForm />
                    </Suspense>
                } />,
                <Route path="loan-details" element={
                    <Suspense fallback={<div>Loading...</div>}>
                        <LoanDetailsForm />
                    </Suspense>
                } />,
            </Route>
            <Route path="/loan-application/eligibility-results" element={
                <Suspense fallback={<div>Loading...</div>}>
                    <EligibilityResults />
                </Suspense>
            } />,
        </Route>
    )
)

export default router