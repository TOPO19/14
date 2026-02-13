<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class HomeController extends AbstractController
{
    #[Route('/', name: 'home')]
    public function index(Request $request): Response
    {
        // Réinitialiser la progression du quiz à chaque visite sur l'accueil
        $request->getSession()->remove('quiz_completed');
        $request->getSession()->remove('quiz_step');

        return $this->render('home/index.html.twig');
    }
}
