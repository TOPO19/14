<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class FinalController extends AbstractController
{
    #[Route('/surprise', name: 'final_surprise')]
    public function index(Request $request): Response
    {
        $session = $request->getSession();

        // Protéger l'accès : il faut avoir complété le quiz
        if (!$session->get('quiz_completed', false)) {
            return $this->redirectToRoute('quiz');
        }

        return $this->render('final/index.html.twig');
    }
}
