import {ReactElement, useState} from "react";
import {
  CheckIcon,
  CreditCardIcon,
  ZapIcon,
  StarIcon,
  TrophyIcon,
  CalendarIcon,
  ArrowRightIcon,
} from "lucide-react";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {cn} from "@/lib/utils";

/* ========================================
   = Data =
========================================= */
const PLANS = [
  {
    id: "basico",
    name: "Básico",
    price: "Gratis",
    period: "",
    icon: ZapIcon,
    color: "text-muted-foreground",
    accent: "border-border",
    highlight: false,
    features: [
      "Hasta 5 clientes",
      "10 rutinas predefinidas",
      "Seguimiento básico",
      "Soporte por correo",
    ],
    unavailable: ["Planes de nutrición", "Análisis avanzados", "App móvil"],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$19",
    period: "/mes",
    icon: StarIcon,
    color: "text-brand",
    accent: "border-brand",
    highlight: true,
    features: [
      "Hasta 50 clientes",
      "Rutinas ilimitadas",
      "Planes de nutrición",
      "Análisis de progreso",
      "App móvil incluida",
      "Soporte prioritario",
    ],
    unavailable: [],
  },
  {
    id: "elite",
    name: "Elite",
    price: "$49",
    period: "/mes",
    icon: TrophyIcon,
    color: "text-amber-500",
    accent: "border-amber-500/60",
    highlight: false,
    features: [
      "Clientes ilimitados",
      "Todo en Pro",
      "IA para recomendaciones",
      "Reportes personalizados",
      "API acceso",
      "Gestor de cuenta dedicado",
    ],
    unavailable: [],
  },
];

const BILLING_HISTORY = [
  {id: "INV-001", date: "01 Abr 2026", plan: "Pro", amount: "$19.00", status: "Pagado"},
  {id: "INV-002", date: "01 Mar 2026", plan: "Pro", amount: "$19.00", status: "Pagado"},
  {id: "INV-003", date: "01 Feb 2026", plan: "Pro", amount: "$19.00", status: "Pagado"},
  {id: "INV-004", date: "01 Ene 2026", plan: "Pro", amount: "$19.00", status: "Pagado"},
];

/* ========================================
   = Page =
========================================= */
export default function SubscriptionPage() {
  const [currentPlan] = useState("pro");

  return (
    <div className='max-w-5xl mx-auto space-y-8'>

      {/* Header */}
      <div className='flex items-center gap-3'>
        <div className='p-2 rounded-lg bg-brand/10'>
          <CreditCardIcon className='size-5 text-brand' />
        </div>
        <div>
          <h1 className='text-xl font-semibold'>Suscripción</h1>
          <p className='text-sm text-muted-foreground'>
            Gestiona tu plan y facturación
          </p>
        </div>
      </div>

      {/* Current plan banner */}
      <div className='relative overflow-hidden rounded-xl border border-brand/30 bg-gradient-to-r from-brand/10 via-brand/5 to-transparent p-5'>
        <div className='flex flex-col sm:flex-row sm:items-center gap-4'>
          <div className='flex items-center gap-3'>
            <div className='p-2.5 rounded-full bg-brand/15'>
              <StarIcon className='size-5 text-brand' />
            </div>
            <div>
              <p className='text-xs text-muted-foreground uppercase tracking-wider'>
                Plan actual
              </p>
              <p className='text-lg font-bold'>Pro</p>
            </div>
          </div>
          <div className='sm:ml-auto flex flex-wrap gap-4 text-sm'>
            <div className='flex items-center gap-2 text-muted-foreground'>
              <CalendarIcon className='size-4' />
              Próximo cobro:{" "}
              <span className='text-foreground font-medium'>01 May 2026</span>
            </div>
            <div className='flex items-center gap-2 text-muted-foreground'>
              Monto:{" "}
              <span className='text-foreground font-medium'>$19.00 / mes</span>
            </div>
          </div>
        </div>
        {/* decorative circle */}
        <div className='pointer-events-none absolute -right-12 -top-12 size-40 rounded-full bg-brand/8' />
      </div>

      {/* Plan cards */}
      <div>
        <h2 className='text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4'>
          Planes disponibles
        </h2>
        <div className='grid md:grid-cols-3 gap-4'>
          {PLANS.map((plan) => {
            const Icon = plan.icon;
            const isActive = plan.id === currentPlan;
            return (
              <Card
                key={plan.id}
                className={cn(
                  "relative overflow-hidden transition-all duration-200 bg-card-surface",
                  plan.highlight
                    ? "border-brand shadow-md shadow-brand/10"
                    : "border-border",
                  isActive && "ring-2 ring-brand ring-offset-2 ring-offset-background",
                )}
              >
                {plan.highlight && (
                  <div className='absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand/0 via-brand to-brand/0' />
                )}
                {isActive && (
                  <div className='absolute top-3 right-3'>
                    <Badge className='bg-brand text-white text-[10px] px-2'>
                      Activo
                    </Badge>
                  </div>
                )}
                <CardHeader className='pb-3 pt-5'>
                  <div className={cn("flex items-center gap-2 mb-3", plan.color)}>
                    <Icon className='size-5' />
                    <span className='font-bold text-base'>{plan.name}</span>
                  </div>
                  <div className='flex items-end gap-1'>
                    <span className='text-3xl font-bold'>{plan.price}</span>
                    <span className='text-sm text-muted-foreground pb-1'>
                      {plan.period}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <ul className='space-y-2'>
                    {plan.features.map((f) => (
                      <li key={f} className='flex items-start gap-2 text-sm'>
                        <CheckIcon className='size-4 text-brand mt-0.5 shrink-0' />
                        <span>{f}</span>
                      </li>
                    ))}
                    {plan.unavailable.map((f) => (
                      <li
                        key={f}
                        className='flex items-start gap-2 text-sm text-muted-foreground line-through'
                      >
                        <span className='size-4 mt-0.5 shrink-0' />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant={isActive ? "outline" : "default"}
                    className={cn(
                      "w-full gap-2 mt-2",
                      !isActive && plan.highlight && "bg-brand hover:bg-brand/90 text-white",
                    )}
                    disabled={isActive}
                  >
                    {isActive ? (
                      "Plan actual"
                    ) : (
                      <>
                        Cambiar a {plan.name}
                        <ArrowRightIcon className='size-3.5' />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Billing history */}
      <div>
        <h2 className='text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4'>
          Historial de pagos
        </h2>
        <Card className='bg-card-surface overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b bg-muted/40'>
                  <th className='text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide'>
                    Factura
                  </th>
                  <th className='text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide'>
                    Fecha
                  </th>
                  <th className='text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide'>
                    Plan
                  </th>
                  <th className='text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide'>
                    Monto
                  </th>
                  <th className='text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide'>
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody>
                {BILLING_HISTORY.map((invoice, i) => (
                  <tr
                    key={invoice.id}
                    className={cn(
                      "border-b last:border-0 hover:bg-muted/30 transition-colors",
                      i % 2 === 0 && "bg-muted/10",
                    )}
                  >
                    <td className='px-4 py-3 font-mono text-xs text-muted-foreground'>
                      {invoice.id}
                    </td>
                    <td className='px-4 py-3'>{invoice.date}</td>
                    <td className='px-4 py-3'>{invoice.plan}</td>
                    <td className='px-4 py-3 font-medium'>{invoice.amount}</td>
                    <td className='px-4 py-3'>
                      <Badge
                        variant='outline'
                        className='border-emerald-500/40 text-emerald-600 bg-emerald-500/10 text-[10px]'
                      >
                        {invoice.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}

SubscriptionPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
